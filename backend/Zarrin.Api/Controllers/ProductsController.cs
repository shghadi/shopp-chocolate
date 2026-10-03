using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zarrin.Api.Data;
using Zarrin.Api.Dtos;
using Zarrin.Api.Models;

namespace Zarrin.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ProductDto>>> List(
        [FromQuery] string? category,
        [FromQuery] string? q,
        [FromQuery] bool? featured)
    {
        var query = db.Products.Include(product => product.Category).AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
        {
            var slug = category.Trim();
            query = query.Where(product => product.Category.Slug == slug);
        }

        if (featured == true)
            query = query.Where(product => product.IsFeatured);

        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = q.Trim();
            query = query.Where(product => product.Name.Contains(term) || product.Description.Contains(term));
        }

        var products = await query
            .OrderBy(product => product.Category.SortOrder)
            .ThenBy(product => product.Name)
            .ToListAsync();

        return Ok(products.Select(Map).ToList());
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProductDto>> Get(string slug)
    {
        var product = await db.Products
            .Include(item => item.Category)
            .FirstOrDefaultAsync(item => item.Slug == slug);

        if (product is null)
            return NotFound(new { message = "محصول پیدا نشد." });

        return Ok(Map(product));
    }

    private static ProductDto Map(Product product) => new(
        product.Id,
        product.Name,
        product.Slug,
        product.Description,
        product.Price,
        product.Unit,
        product.WeightLabel,
        product.ImageUrl,
        product.IsFeatured,
        product.Stock,
        product.Category.Name,
        product.Category.Slug);
}
