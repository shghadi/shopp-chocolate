namespace Zarrin.Api.Dtos;

public record CategoryDto(
    int Id,
    string Name,
    string Slug,
    string Description,
    string ImageUrl,
    int ProductCount);

public record ProductDto(
    int Id,
    string Name,
    string Slug,
    string Description,
    long Price,
    string Unit,
    string WeightLabel,
    string ImageUrl,
    bool IsFeatured,
    int Stock,
    string CategoryName,
    string CategorySlug);

public record CreateOrderItemRequest(int ProductId, int Quantity);

public record CreateOrderRequest(
    string CustomerName,
    string Phone,
    string Address,
    string? Note,
    List<CreateOrderItemRequest> Items);

public record OrderItemResponse(
    string ProductName,
    string Unit,
    int Quantity,
    long UnitPrice,
    long LineTotal);

public record OrderResponse(
    int Id,
    string CustomerName,
    string Phone,
    string Address,
    string? Note,
    long Total,
    DateTime CreatedAt,
    List<OrderItemResponse> Items,
    string Status);

public record CreateMessageRequest(
    string Name,
    string Phone,
    string? Email,
    string Body);
