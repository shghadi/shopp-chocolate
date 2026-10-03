using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Zarrin.Api.Auth;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public sealed class AdminOnlyAttribute : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var config = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
        var header = context.HttpContext.Request.Headers.Authorization.ToString();
        const string prefix = "Bearer ";

        if (!header.StartsWith(prefix, StringComparison.OrdinalIgnoreCase) ||
            !AdminToken.TryValidate(config, header[prefix.Length..].Trim(), out _))
        {
            context.Result = new UnauthorizedObjectResult(new { message = "برای دیدن پنل دوباره وارد شوید." });
            return;
        }

        await next();
    }
}
