using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/user-subscriptions")]
public class UserSubscriptionAdminController : ControllerBase
{
    private readonly IUserSubscriptionService _service;

    public UserSubscriptionAdminController(IUserSubscriptionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());
}
