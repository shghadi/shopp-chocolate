using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zarrin.Api.Data;
using Zarrin.Api.Dtos;

namespace Zarrin.Api.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<CategoryDto>>> List()
    {
        var categories = await db.Categories
            .OrderBy(category => category.SortOrder)
            .Select(category => new CategoryDto(
                category.Id,
                category.Name,
                category.Slug,
                category.Description,
                category.ImageUrl,
                category.Products.Count))
            .ToListAsync();

        return Ok(categories);
    }
}
