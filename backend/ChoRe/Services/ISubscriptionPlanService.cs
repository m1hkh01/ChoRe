public interface ISubscriptionPlanService
{
    Task<List<SubscriptionPlanDto>> GetAllAsync();
    Task CreateAsync(CreateUpdateSubscriptionPlanDto dto);
    Task UpdateAsync(int id, CreateUpdateSubscriptionPlanDto dto);
    Task ToggleAsync(int id);
    Task DeleteAsync(int id);
}
