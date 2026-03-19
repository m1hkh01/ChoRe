using ChoRe.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChoRe.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin/dashboard")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AdminDashboardController(AppDbContext context) => _context = context;

        // ════════════════════════════════════════════════════════════════
        //  GET /api/admin/dashboard/overview
        // ════════════════════════════════════════════════════════════════
        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalPosts = await _context.Posts.CountAsync();
            var totalBrands = await _context.Brands.CountAsync();
            var parentBrands = await _context.Brands.CountAsync(b => b.ParentBrandId == null);
            var childBrands = totalBrands - parentBrands;
            var totalCategories = await _context.Categories.CountAsync();
            var parentCategories = await _context.Categories.CountAsync(c => c.ParentCateId == null);
            var childCategories = totalCategories - parentCategories;
            var totalReviews = await _context.Reviews.CountAsync();
            var totalComments = await _context.Comments.CountAsync();
            var totalEscrow = await _context.EscrowTransations.CountAsync();

            var totalSubOrders = await _context.SubscriptionOrders
                .CountAsync(o => o.OrdStatusId == EscrowStatus.Paid);

            var totalRevenue = await _context.SubscriptionOrders
                .Where(o => o.OrdStatusId == EscrowStatus.Paid)
                .SumAsync(o => (decimal?)o.Amount) ?? 0;

            return Ok(new
            {
                users = new { total = totalUsers },
                posts = new { total = totalPosts },
                brands = new { total = totalBrands, parent = parentBrands, child = childBrands },
                categories = new { total = totalCategories, parent = parentCategories, child = childCategories },
                reviews = new { total = totalReviews },
                comments = new { total = totalComments },
                escrow = new { total = totalEscrow },
                subOrders = new { total = totalSubOrders, revenue = totalRevenue },
            });
        }

        // ════════════════════════════════════════════════════════════════
        //  GET /api/admin/dashboard/stats?from=&to=&groupBy=day|month|year
        // ════════════════════════════════════════════════════════════════
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats(
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            [FromQuery] string groupBy = "day")
        {
            var start = (from ?? DateTime.Now.AddDays(-29)).Date;
            var end = (to ?? DateTime.Now).Date;

            // ── Pull raw dates from DB ─────────────────────────────────
            var usersRaw = await _context.Users
                .Where(u => u.CreateAt.Date >= start && u.CreateAt.Date <= end)
                .Select(u => u.CreateAt)
                .ToListAsync();

            var postsRaw = await _context.Posts
                .Where(p => p.CreatedAt.Date >= start && p.CreatedAt.Date <= end)
                .Select(p => new { p.CreatedAt, p.PostStatusId })
                .ToListAsync();

            var reviewsRaw = await _context.Reviews
                .Where(r => r.CreatedAt.Date >= start && r.CreatedAt.Date <= end)
                .Select(r => r.CreatedAt)
                .ToListAsync();

            var commentsRaw = await _context.Comments
                .Where(c => c.CreateAt.Date >= start && c.CreateAt.Date <= end)
                .Select(c => c.CreateAt)
                .ToListAsync();

            var escrowRaw = await _context.EscrowTransations
                .Where(e => e.CreateAt.Date >= start && e.CreateAt.Date <= end)
                .Select(e => new { e.CreateAt, e.EscrowTransStatusId, e.TotalAmount })
                .ToListAsync();

            var subOrdersRaw = await _context.SubscriptionOrders
                .Where(o => o.CreatedAt.Date >= start && o.CreatedAt.Date <= end)
                .Select(o => new { o.CreatedAt, o.OrdStatusId, o.Amount })
                .ToListAsync();

            // ── Group key helper ───────────────────────────────────────
            string Key(DateTime d) => groupBy switch
            {
                "month" => d.ToString("yyyy-MM"),
                "year" => d.ToString("yyyy"),
                _ => d.ToString("yyyy-MM-dd"),
            };

            // ── Build date axis ────────────────────────────────────────
            var allKeys = BuildDateAxis(start, end, groupBy);

            // ── Aggregate into dictionaries ────────────────────────────
            var usersByDate = usersRaw.GroupBy(d => Key(d)).ToDictionary(g => g.Key, g => g.Count());
            var postsByDate = postsRaw.GroupBy(p => Key(p.CreatedAt)).ToDictionary(g => g.Key, g => g.Count());
            var approvedByDate = postsRaw.Where(p => p.PostStatusId == 2)
                                         .GroupBy(p => Key(p.CreatedAt))
                                         .ToDictionary(g => g.Key, g => g.Count());
            var reviewsByDate = reviewsRaw.GroupBy(d => Key(d)).ToDictionary(g => g.Key, g => g.Count());
            var commentsByDate = commentsRaw.GroupBy(d => Key(d)).ToDictionary(g => g.Key, g => g.Count());
            var escrowByDate = escrowRaw.GroupBy(e => Key(e.CreateAt)).ToDictionary(g => g.Key, g => g.Count());
            var subOrdByDate = subOrdersRaw
                .Where(o => o.OrdStatusId == EscrowStatus.Paid)
                .GroupBy(o => Key(o.CreatedAt))
                .ToDictionary(g => g.Key, g => new
                {
                    count = g.Count(),
                    revenue = g.Sum(x => x.Amount),
                });

            // ── Map to result ──────────────────────────────────────────
            var result = allKeys.Select(k => new
            {
                date = k,
                users = usersByDate.GetValueOrDefault(k, 0),
                posts = postsByDate.GetValueOrDefault(k, 0),
                approved = approvedByDate.GetValueOrDefault(k, 0),
                reviews = reviewsByDate.GetValueOrDefault(k, 0),
                comments = commentsByDate.GetValueOrDefault(k, 0),
                escrow = escrowByDate.GetValueOrDefault(k, 0),
                subOrders = subOrdByDate.ContainsKey(k) ? subOrdByDate[k].count : 0,
                revenue = subOrdByDate.ContainsKey(k) ? subOrdByDate[k].revenue : 0m,
            }).ToList();

            return Ok(result);
        }

        // ════════════════════════════════════════════════════════════════
        //  GET /api/admin/dashboard/post-status
        // ════════════════════════════════════════════════════════════════
        [HttpGet("post-status")]
        public async Task<IActionResult> GetPostStatusDistribution()
        {
            var dist = await _context.Posts
                .GroupBy(p => p.PostStatusId)
                .Select(g => new { statusId = g.Key, count = g.Count() })
                .ToListAsync();

            var statusNames = new Dictionary<int, string>
            {
                [1] = "Chờ duyệt",
                [2] = "Đang bán",
                [3] = "Từ chối",
                [5] = "Đã bán",
                [6] = "Đã ẩn",
                [7] = "Chờ thanh toán",
            };

            return Ok(dist.Select(d => new
            {
                statusId = d.statusId,
                label = statusNames.GetValueOrDefault(d.statusId, $"Status {d.statusId}"),
                count = d.count,
            }));
        }

        // ════════════════════════════════════════════════════════════════
        //  GET /api/admin/dashboard/top-plans
        // ════════════════════════════════════════════════════════════════
        [HttpGet("top-plans")]
        public async Task<IActionResult> GetTopPlans()
        {
            var plans = await _context.SubscriptionOrders
                .Where(o => o.OrdStatusId == EscrowStatus.Paid)
                .Include(o => o.SubscriptionPlan)
                .GroupBy(o => new { o.SubPlanId, o.SubscriptionPlan.SubPlanName })
                .Select(g => new
                {
                    planId = g.Key.SubPlanId,
                    planName = g.Key.SubPlanName,
                    count = g.Count(),
                    revenue = g.Sum(o => o.Amount),
                })
                .OrderByDescending(x => x.count)
                .ToListAsync();

            return Ok(plans);
        }

        // ════════════════════════════════════════════════════════════════
        //  Helper — build date axis labels
        // ════════════════════════════════════════════════════════════════
        private static List<string> BuildDateAxis(DateTime start, DateTime end, string groupBy)
        {
            var keys = new List<string>();
            var cur = start.Date;

            while (cur <= end)
            {
                var key = groupBy switch
                {
                    "month" => cur.ToString("yyyy-MM"),
                    "year" => cur.ToString("yyyy"),
                    _ => cur.ToString("yyyy-MM-dd"),
                };

                if (!keys.Contains(key)) keys.Add(key);

                cur = groupBy switch
                {
                    "month" => cur.AddMonths(1),
                    "year" => cur.AddYears(1),
                    _ => cur.AddDays(1),
                };
            }

            return keys;
        }
    }
}