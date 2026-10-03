using System.Security.Cryptography;
using System.Text;

namespace Zarrin.Api.Auth;

public static class AdminToken
{
    public static string Create(IConfiguration config, string username)
    {
        var expiry = DateTimeOffset.UtcNow.AddHours(12).ToUnixTimeSeconds();
        var payload = $"{username}|{expiry}";
        return $"{Base64Url(payload)}.{Sign(Secret(config), payload)}";
    }

    public static bool TryValidate(IConfiguration config, string token, out string username)
    {
        username = "";
        var parts = token.Split('.');
        if (parts.Length != 2) return false;

        try
        {
            var payload = Encoding.UTF8.GetString(Base64UrlDecode(parts[0]));
            var actual = Base64UrlDecode(parts[1]);
            var expected = Hmac(Secret(config), payload);
            if (actual.Length != expected.Length || !CryptographicOperations.FixedTimeEquals(actual, expected))
                return false;

            var bits = payload.Split('|');
            if (bits.Length != 2 || !long.TryParse(bits[1], out var expiry)) return false;
            if (expiry < DateTimeOffset.UtcNow.ToUnixTimeSeconds()) return false;

            username = bits[0];
            return username.Length > 0;
        }
        catch (FormatException)
        {
            return false;
        }
    }

    public static bool PasswordMatches(IConfiguration config, string username, string password)
    {
        var expectedUser = config["Admin:Username"] ?? "";
        var expectedPassword = config["Admin:Password"] ?? "";
        return FixedTextEquals(username, expectedUser) && FixedTextEquals(password, expectedPassword);
    }

    private static string Secret(IConfiguration config) =>
        config["Admin:TokenSecret"] ?? "zarrin-local-token-secret";

    private static bool FixedTextEquals(string left, string right)
    {
        var a = Encoding.UTF8.GetBytes(left);
        var b = Encoding.UTF8.GetBytes(right);
        return a.Length == b.Length && CryptographicOperations.FixedTimeEquals(a, b);
    }

    private static string Sign(string secret, string payload) => Base64Url(Hmac(secret, payload));

    private static byte[] Hmac(string secret, string payload)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        return hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
    }

    private static string Base64Url(string text) => Base64Url(Encoding.UTF8.GetBytes(text));

    private static string Base64Url(byte[] bytes) =>
        Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');

    private static byte[] Base64UrlDecode(string text)
    {
        var value = text.Replace('-', '+').Replace('_', '/');
        var padding = value.Length % 4;
        if (padding == 2) value += "==";
        else if (padding == 3) value += "=";
        return Convert.FromBase64String(value);
    }
}
