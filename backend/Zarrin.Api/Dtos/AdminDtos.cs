namespace Zarrin.Api.Dtos;

public record AdminLoginRequest(string Username, string Password);

public record AdminLoginResponse(string Token, string Username);

public record AdminSummaryDto(
    int NewOrders,
    int ConfirmedOrders,
    int ShippedOrders,
    int DeliveredOrders,
    int CancelledOrders,
    int LowStock,
    int ProductCount);

public record AdminProductDto(
    int Id,
    string Name,
    string CategoryName,
    string Unit,
    long Price,
    int Stock);

public record UpdateStockRequest(int Stock);

public record UpdateStatusRequest(string Status);

public record AdminOrderItemDto(
    int ProductId,
    string ProductName,
    string Unit,
    int Quantity,
    long UnitPrice,
    long LineTotal);

public record AdminOrderDto(
    int Id,
    string CustomerName,
    string Phone,
    string Address,
    string? Note,
    long Total,
    string Status,
    DateTime CreatedAt,
    List<AdminOrderItemDto> Items);

public record AdminCustomerDto(
    string Name,
    string Phone,
    string Address,
    int OrderCount,
    long TotalSpent,
    DateTime LastOrderAt);
