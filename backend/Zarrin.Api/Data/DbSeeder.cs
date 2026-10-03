using System.Text.Json;
using Zarrin.Api.Models;

namespace Zarrin.Api.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db, string contentRoot)
    {
        if (db.Categories.Any())
            return;

        var path = Path.Combine(contentRoot, "Data", "seed.json");
        var json = File.ReadAllText(path, System.Text.Encoding.UTF8);
        var seed = JsonSerializer.Deserialize<SeedFile>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        }) ?? throw new InvalidOperationException("فایل seed.json خوانده نشد.");

        var categories = seed.Categories
            .OrderBy(category => category.SortOrder)
            .Select(category => new Category
            {
                Name = category.Name,
                Slug = category.Slug,
                Description = category.Description,
                ImageUrl = category.ImageUrl,
                SortOrder = category.SortOrder
            })
            .ToList();

        db.Categories.AddRange(categories);
        db.SaveChanges();

        var bySlug = categories.ToDictionary(category => category.Slug);
        var products = seed.Products.Select(product => new Product
        {
            Name = product.Name,
            Slug = product.Slug,
            Description = product.Description,
            Price = product.Price,
            Unit = product.Unit,
            WeightLabel = product.WeightLabel,
            ImageUrl = product.ImageUrl,
            IsFeatured = product.IsFeatured,
            Stock = product.Stock,
            CategoryId = bySlug[product.CategorySlug].Id
        }).ToList();

        db.Products.AddRange(products);
        db.SaveChanges();
    }

    private sealed class SeedFile
    {
        public List<CategorySeed> Categories { get; set; } = new();
        public List<ProductSeed> Products { get; set; } = new();
    }

    private sealed class CategorySeed
    {
        public string Name { get; set; } = "";
        public string Slug { get; set; } = "";
        public string Description { get; set; } = "";
        public string ImageUrl { get; set; } = "";
        public int SortOrder { get; set; }
    }

    private sealed class ProductSeed
    {
        public string Name { get; set; } = "";
        public string Slug { get; set; } = "";
        public string Description { get; set; } = "";
        public long Price { get; set; }
        public string Unit { get; set; } = "";
        public string WeightLabel { get; set; } = "";
        public string ImageUrl { get; set; } = "";
        public bool IsFeatured { get; set; }
        public int Stock { get; set; }
        public string CategorySlug { get; set; } = "";
    }
}
