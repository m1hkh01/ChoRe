using ChoRe.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("/api/sepay")]
public class SepayController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PackageService _service;
    public SepayController(AppDbContext context, PackageService service)
    {
        _context = context;
        _service = service;
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> HandleWebhook([FromBody] SepayWebhookDto webhookData)
    {
        if (webhookData == null || string.IsNullOrEmpty(webhookData.Content))
        {
            return BadRequest();
        }

        var transaction = webhookData.Content.Split("-");
        if (transaction.Length == 0)
        {
            return BadRequest();
        }
        if (transaction[0] == "SUB")
        {
            var orderCode = webhookData.Content;
            var order = await _context.SubscriptionOrders.FirstOrDefaultAsync(o => o.OrderCode == orderCode);
            if (order == null)
            {
                return BadRequest();
            }
            else if (order.OrdStatusId == EscrowStatus.Paid)
            {
                order.PaymentMessage = "Đơn hàng đã được thanh toán";
            }
            else if (order.Amount != webhookData.TransferAmount)
            {
                order.PaymentMessage = "Số tiền không khớp";
            }
            else
            {
                var user = await _context.Users
                                    .Include(u => u.UserSubscription)
                                    .Include(u => u.UserSubUsage)
                                    .FirstOrDefaultAsync(u => u.UserId == order.UserId);
                if (user is null)
                {
                    return NotFound(new { Error = "Không tìm thấy người dùng" });
                }
                await _service.PaySubPlanOrder(user.UserSubUsage, user.UserSubscription, order.OrderCode);
            }
            _context.SubscriptionOrders.Update(order);
            await _context.SaveChangesAsync();
        }
        else if (transaction[0] == "TRANS")
        {
            var orderCode = webhookData.Content;
            var escrow = await _context.EscrowTransations.FirstOrDefaultAsync(t => t.TransactionOrderCode == orderCode);
            if (escrow == null)
            {
                return BadRequest();
            }
            if (escrow.EscrowTransStatusId == EscrowStatus.Paid)
            {
                escrow.PaymentMessage = "Đơn hàng đã được thanh toán";
            }
            if (escrow.TotalAmount != webhookData.TransferAmount)
            {
                escrow.PaymentMessage = "Số tiền không khớp";
            }
            else
            {
                escrow.EscrowTransStatusId = EscrowStatus.Paid;
                escrow.PaymentMessage = "Thanh toán thành công";
            }
            _context.EscrowTransations.Update(escrow);
            await _context.SaveChangesAsync();
        }
        return Ok();
    }
}