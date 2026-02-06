using ChoRe.Data;
using ChoRe.Models;
using Microsoft.EntityFrameworkCore;

public interface IEscrowTransactionService
{
    Task<List<EscrowTransStatus>> GetStatusesAsync(bool isAdmin, bool isTransation = true);
    Task<List<TransactionDto>> GetListAsync(EscrowTransactionFilterRequest req);
    Task<EscrowTransation> GetDetailAsync(int id);
    Task ResolveDisputeAsync(ResolveDisputeRequest req, int adminId);
    Task<List<TransactionDto>>? GetEscrowTransationByIdAsync(int id, EscrowTransactionFilterRequest req);
    Task<List<ServiceTransactionDto>>? GetServiceTransationByIdAsync(int id, EscrowTransactionFilterRequest req);
    Task<EscrowTransation> PayTransaction(PayOrderRequest rq);
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

        if (dispute.StatusId == DisStatus.ResolvedRefund)
        {
            transaction.EscrowTransStatusId = EscrowStatus.Refunded;
        }
        else
        {
            transaction.EscrowTransStatusId = EscrowStatus.Completed;
        }

        dispute.StatusId = req.DisputeSatatus;
        dispute.Decision = req.Decision;
        dispute.DecisionNote = req.DecisionNote;
        dispute.AssignedByAdminUserId = adminId;

        await _context.SaveChangesAsync();
    }
    public async Task<List<TransactionDto>>? GetEscrowTransationByIdAsync(int id, EscrowTransactionFilterRequest req)
    {
        var query = _context.EscrowTransations
            .Include(x => x.BuyerUser)
            .Include(x => x.SellerUser)
            .Include(x => x.EscrowTransStatus)
            .Include(x=>x.Post)
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
                // BuyerId = x.BuyerUserId,
                SellerId = x.SellerUserId,
                PostPrice = x.PostPrice,
                PostImage = x.Post.PostImages.First().PostImage1 ?? "",
                PostTitle = x.Post.Title,
                PlatformFee = x.PlatformFee,
                Amount = x.TotalAmount,
                Status = x.EscrowTransStatus.StatusName,
                StatusDescription = x.EscrowTransStatus.Description,
                CreateAt = x.CreateAt,
                ExpiredAt = x.ExpiredAt,
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
                            : new List<DisEvidenceGroupDto>()
            })
            .ToListAsync();

        // return await _context.EscrowTransations
        // .Include(t => t.ChatMessage)
        // .Include(t => t.EscrowTransStatus)
        // .FirstOrDefaultAsync(t => t.EscrowTransId == id);
    }
    public async Task<List<ServiceTransactionDto>>? GetServiceTransationByIdAsync(int id, EscrowTransactionFilterRequest req)
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
                ServiceName = o.SubscriptionPlan.SubPlanName,
                ServiceType = "Mua gói",
                ServiceCode = o.OrderCode,
                ServicePrice = o.Amount,
                DurationDays = o.SubscriptionPlan.DurationDays,
                StartDate = o.PaidAt,
                ExpiredAt = o.PaidAt.AddDays(o.SubscriptionPlan.DurationDays),
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
}
