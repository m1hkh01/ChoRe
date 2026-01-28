public interface IUserSubscriptionService
{
    Task<List<UserSubscriptionDto>> GetAllAsync();
}
