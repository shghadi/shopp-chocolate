namespace Zarrin.Api.Models;

public static class OrderStatuses
{
    public const string New = "new";
    public const string Confirmed = "confirmed";
    public const string Shipped = "shipped";
    public const string Delivered = "delivered";
    public const string Cancelled = "cancelled";

    public static readonly string[] All =
    [
        New,
        Confirmed,
        Shipped,
        Delivered,
        Cancelled
    ];
}
