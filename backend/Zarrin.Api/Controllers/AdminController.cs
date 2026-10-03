using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zarrin.Api.Auth;
using Zarrin.Api.Data;
using Zarrin.Api.Dtos;
using Zarrin.Api.Models;

namespace Zarrin.Api.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController(AppDbContext db, IConfiguration config) : ControllerBase
{
    public const int LowStockThreshold = 5;

    [HttpPost("login")]
    public ActionResult<AdminLoginResponse> Login(AdminLoginRequest request)
    {
        var username = request.Username?.Trim() ?? "";
        var password = request.Password ?? "";

        if (!AdminToken.PasswordMatches(config, username, password))
            return Unauthorized(new { message = "نام کاربری یا رمز نادرست است." });

        return Ok(new AdminLoginResponse(AdminToken.Create(config, username), username));
    }

    [AdminOnly]
    [HttpGet("summary")]
    public async Task<ActionResult<AdminSummaryDto>> Summary()
    {
        var orders = await db.Orders.AsNoTracking().Select(order => order.Status).ToListAsync();
        var lowStock = await db.Products.CountAsync(product => product.Stock <= LowStockThreshold);
        var productCount = await db.Products.CountAsync();

        return Ok(new AdminSummaryDto(
            orders.Count(status => status == OrderStatuses.New),
            orders.Count(status => status == OrderStatuses.Confirmed),
            orders.Count(status => status == OrderStatuses.Shipped),
            orders.Count(status => status == OrderStatuses.Delivered),
            orders.Count(status => status == OrderStatuses.Cancelled),
            lowStock,
            productCount));
    }

    [AdminOnly]
    [HttpGet("products")]
    public async Task<ActionResult<List<AdminProductDto>>> Products()
    {
        var products = await db.Products
            .AsNoTracking()
            .Include(product => product.Category)
            .OrderBy(product => product.Category.SortOrder)
            .ThenBy(product => product.Name)
            .Select(product => new AdminProductDto(
                product.Id,
                product.Name,
                product.Category.Name,
                product.Unit,
                product.Price,
                product.Stock))
            .ToListAsync();

        return Ok(products);
    }

    [AdminOnly]
    [HttpPatch("products/{id:int}/stock")]
    public async Task<ActionResult<AdminProductDto>> UpdateStock(int id, UpdateStockRequest request)
    {
        if (request.Stock is < 0 or > 100000)
            return BadRequest(new { message = "موجودی باید بین ۰ و ۱۰۰۰۰۰ باشد." });

        var product = await db.Products.Include(item => item.Category).FirstOrDefaultAsync(item => item.Id == id);
        if (product is null)
            return NotFound(new { message = "محصول پیدا نشد." });

        product.Stock = request.Stock;
        await db.SaveChangesAsync();

        return Ok(new AdminProductDto(
            product.Id,
            product.Name,
            product.Category.Name,
            product.Unit,
            product.Price,
            product.Stock));
    }

    [AdminOnly]
    [HttpGet("orders")]
    public async Task<ActionResult<List<AdminOrderDto>>> Orders([FromQuery] string? status, [FromQuery] string? q)
    {
        var query = db.Orders.AsNoTracking().Include(order => order.Items).AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            var wanted = status.Trim();
            if (!OrderStatuses.All.Contains(wanted))
                return BadRequest(new { message = "وضعیت سفارش معتبر نیست." });
            query = query.Where(order => order.Status == wanted);
        }

        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = q.Trim();
            query = query.Where(order =>
                order.CustomerName.Contains(term) ||
                order.Phone.Contains(term) ||
                order.Address.Contains(term));
        }

        var orders = await query.OrderByDescending(order => order.CreatedAt).ToListAsync();
        return Ok(orders.Select(Map).ToList());
    }

    [AdminOnly]
    [HttpGet("orders/{id:int}")]
    public async Task<ActionResult<AdminOrderDto>> Order(int id)
    {
        var order = await db.Orders.AsNoTracking().Include(item => item.Items).FirstOrDefaultAsync(item => item.Id == id);
        if (order is null)
            return NotFound(new { message = "سفارش پیدا نشد." });

        return Ok(Map(order));
    }

    [AdminOnly]
    [HttpPatch("orders/{id:int}/status")]
    public async Task<ActionResult<AdminOrderDto>> UpdateStatus(int id, UpdateStatusRequest request)
    {
        var status = request.Status?.Trim() ?? "";
        if (!OrderStatuses.All.Contains(status))
            return BadRequest(new { message = "وضعیت سفارش معتبر نیست." });

        await using var tx = await db.Database.BeginTransactionAsync();
        var order = await db.Orders.Include(item => item.Items).FirstOrDefaultAsync(item => item.Id == id);
        if (order is null)
            return NotFound(new { message = "سفارش پیدا نشد." });

        if (order.Status == status)
            return Ok(Map(order));

        var wasCancelled = order.Status == OrderStatuses.Cancelled;
        var willCancel = status == OrderStatuses.Cancelled;

        if (!wasCancelled && willCancel)
        {
            await RestoreStock(order);
        }
        else if (wasCancelled && !willCancel)
        {
            var error = await DeductStock(order);
            if (error is not null)
                return BadRequest(new { message = error });
        }

        order.Status = status;
        await db.SaveChangesAsync();
        await tx.CommitAsync();
        return Ok(Map(order));
    }

    [AdminOnly]
    [HttpGet("customers")]
    public async Task<ActionResult<List<AdminCustomerDto>>> Customers()
    {
        var orders = await db.Orders.AsNoTracking().OrderByDescending(order => order.CreatedAt).ToListAsync();
        var customers = orders
            .GroupBy(order => order.Phone.Trim())
            .Select(group =>
            {
                var latest = group.OrderByDescending(order => order.CreatedAt).First();
                var spent = group.Where(order => order.Status != OrderStatuses.Cancelled).Sum(order => order.Total);
                return new AdminCustomerDto(
                    latest.CustomerName,
                    latest.Phone,
                    latest.Address,
                    group.Count(),
                    spent,
                    latest.CreatedAt);
            })
            .OrderByDescending(customer => customer.LastOrderAt)
            .ToList();

        return Ok(customers);
    }

    private async Task RestoreStock(Order order)
    {
        var products = await LoadProducts(order);
        foreach (var item in order.Items)
        {
            if (products.TryGetValue(item.ProductId, out var product))
                product.Stock += item.Quantity;
        }
    }

    private async Task<string?> DeductStock(Order order)
    {
        var products = await LoadProducts(order);
        foreach (var item in order.Items)
        {
            if (!products.TryGetValue(item.ProductId, out var product))
                return $"محصول «{item.ProductName}» دیگر در فهرست نیست.";
            if (product.Stock < item.Quantity)
                return $"موجودی «{product.Name}» برای برگرداندن سفارش کافی نیست.";
        }

        foreach (var item in order.Items)
            products[item.ProductId].Stock -= item.Quantity;

        return null;
    }

    private async Task<Dictionary<int, Product>> LoadProducts(Order order)
    {
        var ids = order.Items.Select(item => item.ProductId).Distinct().ToList();
        return await db.Products.Where(product => ids.Contains(product.Id)).ToDictionaryAsync(product => product.Id);
    }

    private static AdminOrderDto Map(Order order) => new(
        order.Id,
        order.CustomerName,
        order.Phone,
        order.Address,
        order.Note,
        order.Total,
        order.Status,
        order.CreatedAt,
        order.Items.Select(item => new AdminOrderItemDto(
            item.ProductId,
            item.ProductName,
            item.Unit,
            item.Quantity,
            item.UnitPrice,
            item.UnitPrice * item.Quantity)).ToList());
}
