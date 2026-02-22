using ChoRe.Data;
using ChoRe.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

public interface IEscrowTransactionService
{
    Task<List<EscrowTransStatus>> GetStatusesAsync(bool isAdmin, bool isTransation = true);
    Task<List<TransactionDto>> GetListAsync(EscrowTransactionFilterRequest req);
    Task<EscrowTransation> GetDetailAsync(int id);
    Task ResolveDisputeAsync(ResolveDisputeRequest req, int adminId);
    Task<List<TransactionDto>>? GetEscrowsByIdAsync(int id, EscrowTransactionFilterRequest req);
    Task<TransactionDto?> GetEscrowByIdAsync(int id);
    Task<List<ServiceTransactionDto>>? GetServicesByIdAsync(int id, EscrowTransactionFilterRequest req);
    Task<EscrowTransation> PayTransaction(PayOrderRequest rq);
    Task<EscrowTransation?> ConfirmTransaction(int transactionId, bool isBuyer, decimal postPrice, bool updatePrice);
    Task RejectTransaction(int transactionId);
    Task RefundRequest(int transactionId, RefundRequestDto req);
    Task CompleteTransaction(int transactionId);
    Task RefundConfirmTransaction(int transactionId);
    Task RefundRejectTransaction(int disputeId);
    Task RefundSystemTransaction(int disputeId, List<DisEvidenceDto>? evidences, int userId);
}
public class EscrowTransactionService : IEscrowTransactionService
{
    private readonly AppDbContext _context;

    public EscrowTransactionService(AppDbContext context)
    {
        _context = context;
    }
    public async Task<List<EscrowTransStatus>> GetStatusesAsync(bool isAdmin, bool isTransation = true)
    {
        if (isTransation)
        {

            if (isAdmin)
            {
                string[] getStatus = ["PendingPayment", "Paid", "Completed", "Disputing", "Cancelled"];
                return await _context.EscrowTransStatuses.Where(s => getStatus.Contains(s.StatusName)).ToListAsync();
            }
            else
            {
                return await _context.EscrowTransStatuses.ToListAsync();
            }
        }
        else
        {
            string[] getStatus = ["PendingPayment", "Paid", "Cancelled"];
            return await _context.EscrowTransStatuses.Where(s => getStatus.Contains(s.StatusName)).ToListAsync();
        }
    }
    public async Task<List<TransactionDto>> GetListAsync(EscrowTransactionFilterRequest req)
    {
        int[] getStatus = [
            EscrowStatus.PendingPayment,
            EscrowStatus.Paid,
            EscrowStatus.Completed,
            EscrowStatus.Disputing,
            EscrowStatus.Cancelled
        ];
        var query = _context.EscrowTransations
            .Include(x => x.BuyerUser)
            .Include(x => x.SellerUser)
            .Include(x => x.EscrowTransStatus)
            .Include(x => x.Disputes)
                .ThenInclude(d => d.DisputeEvidences)
            .Where(x => getStatus.Contains(x.EscrowTransStatusId))
            .AsQueryable();

        if (!string.IsNullOrEmpty(req.Keyword))
        {
            query = query.Where(x =>
                x.BuyerUser.FullName.Contains(req.Keyword) ||
                x.SellerUser.FullName.Contains(req.Keyword));
        }

        if (req.StatusId.HasValue)
            query = query.Where(x => x.EscrowTransStatusId == req.StatusId);

        if (req.FromDate.HasValue)
            query = query.Where(x => x.CreateAt >= req.FromDate);

        if (req.ToDate.HasValue)
            query = query.Where(x => x.CreateAt <= req.ToDate);

        return await query
            .OrderByDescending(x => x.CreateAt)
            .Select(x => new TransactionDto
            {
                TransactionId = x.EscrowTransId,
                TransactionOrderCode = x.TransactionOrderCode,
                BuyerName = x.BuyerUser.FullName,
                SellerName = x.SellerUser.FullName,
                BuyerId = x.BuyerUserId,
                SellerId = x.SellerUserId,
                PostPrice = x.PostPrice,
                PlatformFee = x.PlatformFee,
                Amount = x.TotalAmount,
                Status = x.EscrowTransStatus.StatusName,
                StatusDescription = x.EscrowTransStatus.Description,
                CreateAt = x.CreateAt,
                DisputeId = x.Disputes != null ? x.Disputes.DisputeId : 0,
                DisputeReason = x.Disputes != null ? x.Disputes.DisputeReason : null,
                DisEvidence = x.Disputes != null
                            ? x.Disputes.DisputeEvidences
                                .GroupBy(d => d.SubmitByUserId)
                                .Select(g => new DisEvidenceGroupDto
                                {
                                    SubmitByUserId = g.Key,
                                    Evidences = g.Select(d => new DisEvidenceDto
                                    {
                                        DisEvidenceLink = d.FileLink,
                                        Description = d.Description
                                    }).ToList()
                                }).ToList()
                            : new List<DisEvidenceGroupDto>()
            })
            .ToListAsync();
    }

    public async Task<EscrowTransation> GetDetailAsync(int id)
    {
        return await _context.EscrowTransations
            .Include(x => x.Disputes)
                .ThenInclude(d => d.DisputeEvidences)
            .FirstOrDefaultAsync(x => x.EscrowTransId == id);
    }

    public async Task ResolveDisputeAsync(ResolveDisputeRequest req, int adminId)
    {
        var dispute = await _context.Disputes.FindAsync(req.DisputeId);
        var transaction = await _context.EscrowTransations.FindAsync(req.EscrowTransId);
        if (dispute == null) throw new Exception("Không tìm thấy tranh chấp");
        if (transaction == null) throw new Exception("Không tìm thấy giao dịch");

        if (req.DisputeSatatus == DisStatus.ResolvedRefund)
        {
            transaction.EscrowTransStatusId = EscrowStatus.Refunded;
        }
        else
        {
            transaction.EscrowTransStatusId = EscrowStatus.RefundRejected;
        }

        dispute.StatusId = req.DisputeSatatus;
        dispute.Decision = req.Decision;
        dispute.DecisionNote = req.DecisionNote;
        dispute.AssignedByAdminUserId = adminId;

        await _context.SaveChangesAsync();
    }
    public async Task<List<TransactionDto>>? GetEscrowsByIdAsync(int id, EscrowTransactionFilterRequest req)
    {
        var query = _context.EscrowTransations
            .Include(x => x.BuyerUser)
            .Include(x => x.SellerUser)
            .Include(x => x.EscrowTransStatus)
            .Include(x => x.Post)
            .Include(x => x.ChatMessage)
            .Include(x=>x.Review)
                .ThenInclude(r => r.ReviewImages)
            .Include(x=>x.Review)
                .ThenInclude(r => r.ReviewTags)
            .Include(x => x.Disputes)
                .ThenInclude(d => d.DisputeEvidences)
            .Include(x => x.Disputes)
                .ThenInclude(d => d.DisputeStatus)
            .AsQueryable();
        if (!string.IsNullOrEmpty(req.Keyword))
        {
            query = query.Where(x =>
                x.BuyerUser.FullName.Contains(req.Keyword) ||
                x.SellerUser.FullName.Contains(req.Keyword));
        }

        if (req.StatusId.HasValue)
            query = query.Where(x => x.EscrowTransStatusId == req.StatusId);

        if (req.FromDate.HasValue)
            query = query.Where(x => x.CreateAt >= req.FromDate);

        if (req.ToDate.HasValue)
            query = query.Where(x => x.CreateAt <= req.ToDate);

        return await query
            .OrderByDescending(x => x.CreateAt)
            .Select(x => new TransactionDto
            {
                TransactionId = x.EscrowTransId,
                TransactionOrderCode = x.TransactionOrderCode,
                BuyerName = x.BuyerUser.FullName,
                SellerName = x.SellerUser.FullName,
                BuyerConfirmed = x.BuyerConfirmed,
                SellerConfirmed = x.SellerConfirmed,
                // BuyerId = x.BuyerUserId,
                SellerId = x.SellerUserId,
                ChatRoomId = x.ChatMessage != null ? x.ChatMessage.ChatRoomId : 0,
                PostId = x.PostId,
                PostPrice = x.PostPrice,
                PostImage = x.Post.PostImages.First().PostImage1 ?? "",
                PostTitle = x.Post.Title,
                PlatformFee = x.PlatformFee,
                Amount = x.TotalAmount,
                Status = x.EscrowTransStatus.StatusName,
                StatusDescription = x.EscrowTransStatus.Description,
                CreateAt = x.CreateAt,
                ExpiredAt = x.ExpiredAt,
                IsRated = x.IsRated,
                DisputeId = x.Disputes != null ? x.Disputes.DisputeId : 0,
                DisputeReason = x.Disputes != null ? x.Disputes.DisputeReason : null,
                DisputeStatus = x.Disputes != null ? x.Disputes.DisputeStatus.DisStatusName : null,
                DisEvidence = x.Disputes != null
                            ? x.Disputes.DisputeEvidences
                                .GroupBy(d => d.SubmitByUserId)
                                .Select(g => new DisEvidenceGroupDto
                                {
                                    SubmitByUserId = g.Key,
                                    Evidences = g.Select(d => new DisEvidenceDto
                                    {
                                        DisEvidenceLink = d.FileLink,
                                        Description = d.Description
                                    }).ToList()
                                }).ToList()
                            : new List<DisEvidenceGroupDto>(),
                Review = x.IsRated ? new ReviewDto
                {
                    ReviewId = x.Review.ReviewId,
                    Rating = x.Review.Rating,
                    Comment = x.Review.Comment,
                    Tags = x.Review.ReviewTags != null ? x.Review.ReviewTags
                        .Select(t => t.Tag)
                        .ToList() : new List<string>(),
                    ReviewImages = x.Review.ReviewImages != null ? x.Review.ReviewImages
                        .Select(ri => new ReviewImageDto
                        {
                            FileUrl = ri.FileUrl,
                            Type = ri.FileType
                        })
                        .ToList() : new List<ReviewImageDto>()
                } : null

            })
            .ToListAsync();

        // return await _context.EscrowTransations
        // .Include(t => t.ChatMessage)
        // .Include(t => t.EscrowTransStatus)
        // .FirstOrDefaultAsync(t => t.EscrowTransId == id);
    }

    public async Task<TransactionDto?> GetEscrowByIdAsync(int id)
    {
        var escrow = await _context.EscrowTransations
            .Include(x => x.BuyerUser)
            .Include(x => x.SellerUser)
            .Include(x => x.ChatMessage)
            .FirstOrDefaultAsync(e => e.EscrowTransId == id);
        if (escrow is null) return new TransactionDto();
        var query = new TransactionDto
        {
            TransactionId = escrow.EscrowTransId,
            TransactionOrderCode = escrow.TransactionOrderCode,
            SellerId = escrow.SellerUserId,
            BuyerId = escrow.BuyerUserId,
            PostId = escrow.PostId,
            ChatRoomId = escrow.ChatMessage.ChatRoomId,
            BuyerName = escrow.BuyerUser.FullName,
            SellerName = escrow.SellerUser.FullName,
            PlatformFee = escrow.PlatformFee,
            Amount = escrow.TotalAmount,
            PostPrice = escrow.PostPrice,
        };
        return query;
    }
    public async Task<List<ServiceTransactionDto>>? GetServicesByIdAsync(int id, EscrowTransactionFilterRequest req)
    {
        var query = _context.SubscriptionOrders
            .Include(o => o.SubscriptionPlan)
            .Include(o => o.OrderStatus)
            .AsQueryable();
        if (!string.IsNullOrEmpty(req.Keyword))
        {
            query = query.Where(o => o.SubscriptionPlan.SubPlanName == req.Keyword);
        }

        if (req.StatusId.HasValue)
            query = query.Where(o => o.OrdStatusId == req.StatusId);

        if (req.FromDate.HasValue)
            query = query.Where(o => o.CreatedAt >= req.FromDate);

        if (req.ToDate.HasValue)
            query = query.Where(o => o.CreatedAt <= req.ToDate);

        return await query
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new ServiceTransactionDto
            {
                OrderId = o.OrderId,
                ServiceName = o.SubscriptionPlan.SubPlanName,
                ServiceType = "Mua gói",
                ServiceCode = o.OrderCode,
                ServicePrice = o.Amount,
                Status = o.OrderStatus.StatusName,
                StatusDescription = o.OrderStatus.Description,
                DurationDays = o.SubscriptionPlan.DurationDays,
                StartDate = o.PaidAt ?? null,
                ExpiredAt = o.PaidAt.HasValue ? o.PaidAt.Value.AddDays(o.SubscriptionPlan.DurationDays) : null,
            })
            .ToListAsync();

        // return await _context.EscrowTransations
        // .Include(t => t.ChatMessage)
        // .Include(t => t.EscrowTransStatus)
        // .FirstOrDefaultAsync(t => t.EscrowTransId == id);
    }

    public async Task<EscrowTransation> PayTransaction(PayOrderRequest rq)
    {
        var transaction = await _context.EscrowTransations
                                .FirstOrDefaultAsync(t =>
                                t.BuyerUserId == rq.BuyerId &&
                                t.SellerUserId == rq.SellerId &&
                                t.PostId == rq.PostId &&
                                t.TransactionOrderCode == rq.OrderCode);
        if (transaction is null)
        {
            throw new KeyNotFoundException("Không tìm thấy giao dịch");
        }
        transaction.EscrowTransStatusId = EscrowStatus.Paid;
        await _context.SaveChangesAsync();
        await _context.Entry(transaction)
            .Reference(t => t.EscrowTransStatus)
            .LoadAsync();
        return transaction;
    }

    public async Task<EscrowTransation?> ConfirmTransaction(int transactionId, bool isBuyer, decimal postPrice, bool updatePrice)
    {
        try
        {
            var transaction = await _context.EscrowTransations
                                    .Include(t => t.EscrowTransStatus)
                                    .Include(t => t.ChatMessage)
                                    .FirstOrDefaultAsync(t => t.EscrowTransId == transactionId);

            if (transaction is null)
            {
                Console.WriteLine("Không tìm thấy giao dịch");
                return transaction;
            }
            if (isBuyer)
                transaction.BuyerConfirmed = true;
            else
                transaction.SellerConfirmed = true;
            if (transaction.BuyerConfirmed && transaction.SellerConfirmed)
            {
                transaction.EscrowTransStatusId = 2; // 2 = PendingPayment (Chờ thanh toán);
            }
            if (updatePrice)
            {
                // Phí sàn tối thiểu là 20000 và tối đa là 500000
                var platformFee = Math.Min(
                                    Math.Max(
                                        Math.Round(postPrice * 0.03M),
                                    20000),
                                500000);
                transaction.PostPrice = postPrice;
                transaction.PlatformFee = platformFee;
                transaction.TotalAmount = postPrice + platformFee;
            }
            await _context.SaveChangesAsync();
            await _context.Entry(transaction)
                .Reference(t => t.EscrowTransStatus)
                .LoadAsync();

            return transaction;

        }
        catch (Exception err)
        {
            Console.WriteLine("Đã có lỗi xảy ra: " + err.Message);
            return new EscrowTransation();
        }
    }

    public async Task RejectTransaction(int transactionId)
    {
        await UpdateStatus(transactionId, EscrowStatus.Cancelled);
    }

    public async Task RefundRequest(int transactionId, RefundRequestDto req)
    {
        var dispute = new Dispute
        {
            EscrowTransId = req.EscrowTransId,
            OpenedByUserId = req.OpenedByUserId,
            DisputeReason = req.DisputeReason,
            StatusId = DisStatus.PendingSellerResponse
        };
        _context.Disputes.Add(dispute);
        await UpdateStatus(transactionId, EscrowStatus.RefundRequested);
    }

    public async Task CompleteTransaction(int transactionId)
    {
        await UpdateStatus(transactionId, EscrowStatus.Completed);
    }

    public async Task RefundConfirmTransaction(int disputeId)
    {
        var dispute = await _context.Disputes.FindAsync(disputeId);
        if (dispute is null)
        {
            Console.WriteLine("Không tìm thấy tranh chấp / hoàn tiền");
            return;
        }
        dispute.StatusId = DisStatus.ResolvedRefund;
        await UpdateStatus(dispute.EscrowTransId, EscrowStatus.Refunded);
    }

    public async Task RefundRejectTransaction(int disputeId)
    {
        var dispute = await _context.Disputes.FindAsync(disputeId);
        if (dispute is null)
        {
            Console.WriteLine("Không tìm thấy tranh chấp / hoàn tiền");
            return;
        }
        dispute.StatusId = DisStatus.SellerRejected;
        await UpdateStatus(dispute.EscrowTransId, EscrowStatus.RefundRejected);
    }
    public async Task RefundSystemTransaction(int disputeId, List<DisEvidenceDto>? evidences, int userId)
    {
        var dispute = await _context.Disputes.Include(d => d.DisputeEvidences).FirstOrDefaultAsync(d => d.DisputeId == disputeId);
        if (dispute is null)
        {
            Console.WriteLine("Không tìm thấy tranh chấp / hoàn tiền");
            return;
        }
        if (evidences != null && evidences.Count() > 0)
        {
            evidences.ForEach(e =>
            {
                dispute.DisputeEvidences.Add(new DisputeEvidence
                {
                    SubmitByUserId = userId,
                    FileLink = e.DisEvidenceLink,
                    Description = e.Description
                });
            });
        }
        dispute.StatusId = DisStatus.UnderReview;
        await UpdateStatus(dispute.EscrowTransId, EscrowStatus.Disputing);
    }
    public async Task UpdateStatus(int transactionId, int statusId)
    {
        try
        {
            var transaction = await _context.EscrowTransations.FindAsync(transactionId);
            if (transaction is null)
            {
                Console.WriteLine("Không tìm thấy giao dịch");
                return;
            }
            transaction.EscrowTransStatusId = statusId;
            await _context.SaveChangesAsync();

        }
        catch (Exception err)
        {
            Console.WriteLine("Đã có lỗi xảy ra: " + err.Message);
        }
    }


}
