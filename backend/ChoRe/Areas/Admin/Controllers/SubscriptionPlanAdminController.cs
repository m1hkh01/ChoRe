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
        await _service.CreateAsync(dto);
        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateUpdateSubscriptionPlanDto dto)
    {
        await _service.UpdateAsync(id, dto);
        return Ok();
    }

    [HttpPatch("{id}/toggle")]
    public async Task<IActionResult> Toggle(int id)
    {
        await _service.ToggleAsync(id);
        return Ok();
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return Ok();
    }

}
