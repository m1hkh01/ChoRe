using ChoRe.Data;
using ChoRe.Models;
using Microsoft.EntityFrameworkCore;

public interface IEscrowTransactionService
{
    Task<List<EscrowTransStatus>> GetStatusesAsync();
    Task<List<TransactionDto>> GetListAsync(EscrowTransactionFilterRequest req);
    Task<EscrowTransation> GetDetailAsync(int id);
    Task ResolveDisputeAsync(ResolveDisputeRequest req, int adminId);
    Task<EscrowTransation?> GetTransationByIdAsync(int id);
    Task<EscrowTransation> PayTransaction(PayOrderRequest rq);
}
public class EscrowTransactionService : IEscrowTransactionService
{
    private readonly AppDbContext _context;

    public EscrowTransactionService(AppDbContext context)
    {
        _context = context;
    }
    public async Task<List<EscrowTransStatus>> GetStatusesAsync()
    {
        string[] getStatus = ["PendingPayment", "Paid", "Completed", "Disputing", "Cancelled"];
        return await _context.EscrowTransStatuses.Where(s=>getStatus.Contains(s.StatusName)).ToListAsync();
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
                .ThenInclude(d=>d.DisputeEvidences)
            .Where(x=> getStatus.Contains(x.EscrowTransStatusId))
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
                DisputeId = x.Disputes.DisputeId,
                DisputeReason = x.Disputes.DisputeReason,
                DisEvidence = x.Disputes.DisputeEvidences.GroupBy(d => d.SubmitByUserId).Select(g => new DisEvidenceGroupDto
                {
                    SubmitByUserId = g.Key,
                    Evidences = g.Select(d => new DisEvidenceDto
                    {
                        DisEvidenceLink = d.FileLink,
                        Description = d.Description
                    }).ToList()
                }).ToList()
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

        if (dispute.StatusId == DisStatus.Refunded)
        {
            transaction.EscrowTransStatusId = EscrowStatus.Refunded;
        }
        else
        {
            transaction.EscrowTransStatusId = EscrowStatus.RefuseRefund;
        }

        dispute.StatusId = req.DisputeSatatus;
        dispute.Decision = req.Decision;
        dispute.DecisionNote = req.DecisionNote;
        dispute.AssignedByAdminUserId = adminId;

        await _context.SaveChangesAsync();
    }
    public async Task<EscrowTransation?> GetTransationByIdAsync(int id)
    {
        return await _context.EscrowTransations
        .Include(t => t.ChatMessage)
        .Include(t => t.EscrowTransStatus)
        .FirstOrDefaultAsync(t => t.EscrowTransId == id);
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
