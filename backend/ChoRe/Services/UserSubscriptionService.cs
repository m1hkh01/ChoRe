using ChoRe.Data;
using Microsoft.EntityFrameworkCore;

public class UserSubscriptionService : IUserSubscriptionService
{
    private readonly AppDbContext _context;

    public UserSubscriptionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserSubscriptionDto>> GetAllAsync()
    {
        return await _context.UserSubscriptions
            .Include(x => x.User)
            .Include(x => x.SubscriptionPlan)
            .Join(_context.UserSubUsages,
                us => us.UserId,
                usu => usu.UserId,
                (us, usu) => new { us, usu })
            .OrderByDescending(x => x.us.StartDate)
            .Select(x => new UserSubscriptionDto
            {
                UserSubId = x.us.UserSubId,
                UserId = x.us.UserId,
                FullName = x.us.User.FullName,
                Email = x.us.User.Email,

                SubPlanName = x.us.SubscriptionPlan.SubPlanName,
                SubPlanPrice = x.us.SubscriptionPlan.SubPlanPrice,

                StartDate = x.us.StartDate,
                EndDate = x.us.EndDate,
                IsActive = x.us.IsActive && x.us.EndDate >= DateTime.Now,

                RemainingSubPost = x.usu.RemainingSubPost,
                RemainingFreePost = x.usu.RemainingFreePost,
                RemainingSubFPF = x.usu.RemainingSubFPF
            })
            .ToListAsync();
    }
}
