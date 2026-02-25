using ChoRe.Data;

public class ReminderEngineService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public ReminderEngineService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider
                               .GetRequiredService<AppDbContext>();

            var strategies = scope.ServiceProvider
                                  .GetServices<IReminderStrategy>();

            foreach (var strategy in strategies)
            {
                await strategy.ExecuteAsync(
                    context,
                    scope.ServiceProvider,
                    stoppingToken);
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}