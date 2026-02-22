using System.Runtime.CompilerServices;
using System.Security.Claims;
using ChoRe.Data;
using ChoRe.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("/api/package")]
public class ServicePackageController : ControllerBase
{
    private readonly IPackageService _service;
    private readonly AppDbContext _context;
    public ServicePackageController(IPackageService service, AppDbContext context)
    {
        _service = service;
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPackage()
    {
        var packages = await _service.GetAllSubPlan();
        var userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");
        var user = await _context.Users.Include(u => u.UserSubscription).Where(u => u.UserId == userId).Select(u=>new { subPlanId = u.UserSubscription.SubPlanId }).FirstOrDefaultAsync();
        if (user is null)
        {
            return NotFound("Không tìm thấy người dùng");
        }
        var currentPackage = user.subPlanId;
        return Ok(new {package = packages, currentPackage });
    }
    [HttpPost("order")]
    public async Task<IActionResult> CreateSubPlanOrder(SubscriptionPlan subscription)
    {
        var userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");
        var order = await _service.CreateSubPlanOrder(userId, subscription);
        return Ok(new { OrderCode = order.ServiceCode});
    }

    [HttpGet("service-order/{id:int}")]
    public async Task<IActionResult> GetServiceOrder(int id)
    {
        var order = await _service.GetServiceOrder(id);
        return Ok(order);
    }

    [HttpPost("pay-order")]
    public async Task<IActionResult> PaySubPlanOrder(PayOrderRequest rq)
    {
        try
        {
            var userId = int.Parse(User.FindFirst("UserId")?.Value ?? "0");
            var user = await _context.Users
                                    .Include(u => u.UserSubscription)
                                    .Include(u => u.UserSubUsage)
                                    .FirstOrDefaultAsync(u => u.UserId == userId);
            if(user is null)
            {
                return NotFound(new { Error = "Không tìm thấy người dùng" });
            }
            await _service.PaySubPlanOrder(user.UserSubUsage, user.UserSubscription, rq.OrderCode);
            return Ok(new {Message = "Thanh toán thành công"});

        }
        catch (KeyNotFoundException err)
        {
            return NotFound(new { Error = err.Message });
        }
        catch(Exception err)
        {
            return NotFound(new { Error = err.Message });
        }
    }
}