using Microsoft.EntityFrameworkCore;
using ChoRe.DTO;
using ChoRe.Models;
using ChoRe.Data;

public class TransactionAutoCompleteStrategy : IReminderStrategy
{
    public async Task ExecuteAsync(
        AppDbContext context,
        IServiceProvider serviceProvider,
        CancellationToken token)
    {
        var notificationService = serviceProvider.GetRequiredService<INotificationService>();
        var mailService = serviceProvider.GetRequiredService<ISendMailService>();

        var transactionsToComplete = await context.EscrowTransations
            .Include(t => t.SellerUser)
            .Where(t =>
                t.EscrowTransStatusId == EscrowStatus.Shipped
                && t.AutoCompleteAt.HasValue
                && t.AutoCompleteAt < DateTime.UtcNow)
            .ToListAsync(token);

        if (!transactionsToComplete.Any())
            return;

        foreach (var transaction in transactionsToComplete)
        {
            transaction.EscrowTransStatusId = EscrowStatus.Completed;
        }

        await context.SaveChangesAsync(token);

        foreach (var transaction in transactionsToComplete)
        {
            await NotifySellerCompletedBankConfirmAsync(transaction, notificationService, mailService);
        }
    }

    private async Task NotifySellerCompletedBankConfirmAsync(
        EscrowTransation transaction,
        INotificationService notificationService,
        ISendMailService mailService)
    {
        if (transaction == null)
            return;

        if (string.IsNullOrEmpty(transaction.SellerUser?.Email))
            return;

        var title = "Giao dịch đã hoàn tất";
        var message = string.IsNullOrEmpty(transaction.BankNumber) || string.IsNullOrEmpty(transaction.BankName)
            ? "Đơn hàng đã hoàn thành. Vui lòng cập nhật thông tin ngân hàng để nhận tiền."
            : "Đơn hàng đã hoàn thành. Vui lòng kiểm tra và xác nhận lại thông tin ngân hàng để nhận thanh toán.";

        await notificationService.CreateNotificationAsync(new NotificationDto
        {
            UserId = transaction.SellerUserId,
            Title = title,
            Message = message,
            Type = NotificationType.CompletedBankConfirmation,
            RelatedId = transaction.EscrowTransId
        });

        await mailService.SendEmailAsync(
            transaction.SellerUser.Email,
            "Đơn hàng hoàn thành - Xác nhận thông tin ngân hàng",
            $"<p>Xin chào {transaction.SellerUser.UserName},</p>" +
            $"<p>Giao dịch <strong>{transaction.TransactionOrderCode}</strong> đã hoàn thành.</p>" +
            $"<p>{message}</p>"
        );
    }
}