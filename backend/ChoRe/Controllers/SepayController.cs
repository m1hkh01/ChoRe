using ChoRe.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("/api/sepay")]
public class SepayController : ControllerBase
{
    private readonly AppDbContext _context;
    public SepayController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> HandleWebhook([FromBody] SepayWebhookDto webhookData)
    {
        if (webhookData == null || string.IsNullOrEmpty(webhookData.Content))
        {
            return BadRequest("Dữ liệu không hợp lệ");
        }

        var transaction = webhookData.Content.Split("-");
        if (transaction.Length == 0)
        {
            return BadRequest("Content không hợp lệ");
        }
        if (transaction[0] == "SUB")
        {
            var orderCode = webhookData.Content;
            var order = await _context.SubscriptionOrders.FirstOrDefaultAsync(o => o.OrderCode == orderCode);
            if (order == null)
            {
                return NotFound("Không tìm thấy đơn hàng");
            }
            if (order.OrdStatusId == EscrowStatus.Paid)
            {
                return BadRequest("Đơn hàng đã được thanh toán");
            }
            if (order.Amount != webhookData.TransferAmount)
            {
                return BadRequest("Số tiền không khớp");
            }
            order.OrdStatusId = EscrowStatus.Paid;
            _context.SubscriptionOrders.Update(order);
            await _context.SaveChangesAsync();
        }
        else if (transaction[0] == "TRANS")
        {
            var orderCode = webhookData.Content;
            var escrow = await _context.EscrowTransations.FirstOrDefaultAsync(t => t.TransactionOrderCode == orderCode);
            if (escrow == null)
            {
                return NotFound("Không tìm thấy đơn giao dịch");
            }
            if (escrow.EscrowTransStatusId == EscrowStatus.Paid)
            {
                return BadRequest("Đơn hàng đã được thanh toán");
            }
            if (escrow.TotalAmount != webhookData.TransferAmount)
            {
                return BadRequest("Số tiền không khớp");
            }
            escrow.EscrowTransStatusId = EscrowStatus.Paid;
            _context.EscrowTransations.Update(escrow);
            await _context.SaveChangesAsync();
        }

        return Ok("Thanh toán thành công");
    }
}