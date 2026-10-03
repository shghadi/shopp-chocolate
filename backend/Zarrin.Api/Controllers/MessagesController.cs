using Microsoft.AspNetCore.Mvc;
using Zarrin.Api.Data;
using Zarrin.Api.Dtos;
using Zarrin.Api.Models;

namespace Zarrin.Api.Controllers;

[ApiController]
[Route("api/messages")]
public class MessagesController(AppDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> Create(CreateMessageRequest request)
    {
        var name = request.Name?.Trim() ?? "";
        var phone = request.Phone?.Trim() ?? "";
        var email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim();
        var body = request.Body?.Trim() ?? "";

        if (name.Length is < 2 or > 80)
            return BadRequest(new { message = "نام را کامل وارد کنید." });

        var digits = new string(phone.Where(char.IsDigit).ToArray());
        if (digits.Length is < 10 or > 15)
            return BadRequest(new { message = "شماره تماس معتبر نیست." });

        if (email is { Length: > 120 })
            return BadRequest(new { message = "ایمیل طولانی است." });

        if (body.Length is < 5 or > 1000)
            return BadRequest(new { message = "متن پیام را بین ۵ تا ۱۰۰۰ حرف بنویسید." });

        db.Messages.Add(new ContactMessage
        {
            Name = name,
            Phone = phone,
            Email = email,
            Body = body,
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync();
        return StatusCode(StatusCodes.Status201Created, new { message = "پیام شما ثبت شد. به‌زودی پاسخ می‌دهیم." });
    }
}
