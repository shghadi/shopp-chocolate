using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zarrin.Api.Data;
using Zarrin.Api.Dtos;
using Zarrin.Api.Models;

namespace Zarrin.Api.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController(AppDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<OrderResponse>> Create(CreateOrderRequest request)
    {
        var name = request.CustomerName?.Trim() ?? "";
        var phone = request.Phone?.Trim() ?? "";
        var address = request.Address?.Trim() ?? "";
        var note = string.IsNullOrWhiteSpace(request.Note) ? null : request.Note.Trim();

        if (name.Length is < 2 or > 80)
            return BadRequest(new { message = "نام را کامل وارد کنید." });

        if (!IsPhone(phone))
            return BadRequest(new { message = "شماره موبایل معتبر نیست." });

        if (address.Length is < 8 or > 400)
            return BadRequest(new { message = "آدرس را کامل‌تر بنویسید." });

        if (note is { Length: > 500 })
            return BadRequest(new { message = "توضیحات طولانی است." });

        if (request.Items is null || request.Items.Count == 0)
            return BadRequest(new { message = "سبد خرید خالی است." });

        var merged = new Dictionary<int, int>();
        foreach (var item in request.Items)
        {
            if (item.Quantity is < 1 or > 50)
                return BadRequest(new { message = "تعداد هر محصول باید بین ۱ تا ۵۰ باشد." });

            merged[item.ProductId] = merged.GetValueOrDefault(item.ProductId) + item.Quantity;
        }

        await using var tx = await db.Database.BeginTransactionAsync();

        var products = await db.Products
            .Where(product => merged.Keys.Contains(product.Id))
            .ToListAsync();

        if (products.Count != merged.Count)
            return BadRequest(new { message = "یکی از محصولات سبد دیگر موجود نیست." });

        foreach (var product in products)
        {
            var quantity = merged[product.Id];
            if (quantity > 50)
                return BadRequest(new { message = "تعداد هر محصول باید بین ۱ تا ۵۰ باشد." });

            if (product.Stock < quantity)
                return BadRequest(new { message = $"موجودی «{product.Name}» کافی نیست." });
        }

        var order = new Order
        {
            CustomerName = name,
            Phone = phone,
            Address = address,
            Note = note,
            CreatedAt = DateTime.UtcNow,
            Items = products.Select(product =>
            {
                var quantity = merged[product.Id];
                product.Stock -= quantity;
                return new OrderItem
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    Unit = product.Unit,
                    Quantity = quantity,
                    UnitPrice = product.Price
                };
            }).ToList()
        };

        order.Total = order.Items.Sum(item => item.UnitPrice * item.Quantity);
        db.Orders.Add(order);
        await db.SaveChangesAsync();
        await tx.CommitAsync();

        return StatusCode(StatusCodes.Status201Created, Map(order));
    }

    private static bool IsPhone(string phone)
    {
        var digits = new string(phone.Where(char.IsDigit).ToArray());
        return digits.Length is >= 10 and <= 15;
    }

    private static OrderResponse Map(Order order) => new(
        order.Id,
        order.CustomerName,
        order.Phone,
        order.Address,
        order.Note,
        order.Total,
        order.CreatedAt,
        order.Items.Select(item => new OrderItemResponse(
            item.ProductName,
            item.Unit,
            item.Quantity,
            item.UnitPrice,
            item.UnitPrice * item.Quantity)).ToList());
}
