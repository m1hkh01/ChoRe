using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/subscription-plans")]
public class SubscriptionPlanAdminController : ControllerBase
{
    private readonly ISubscriptionPlanService _service;

    public SubscriptionPlanAdminController(ISubscriptionPlanService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpPost]
    public async Task<IActionResult> Create(CreateUpdateSubscriptionPlanDto dto)
    {
        if (dto.MaxFeaturedPosts > 0 && dto.FeaturedDurationDays <= 0)
        {
            throw new Exception("Có bài featured thì phải có thời gian > 0");
        }
        await _service.CreateAsync(dto);
        return Ok();
    }

    [HttpPost("{id}/update")]
    public async Task<IActionResult> Update(int id, CreateUpdateSubscriptionPlanDto dto)
    {
        await _service.UpdateAsync(id, dto);
        return Ok();
    }

    [HttpPost("{id}/toggle")]
    public async Task<IActionResult> Toggle(int id)
    {
        await _service.ToggleAsync(id);
        return Ok();
    }

    [HttpPost("{id}/delete")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return Ok();
    }

}
