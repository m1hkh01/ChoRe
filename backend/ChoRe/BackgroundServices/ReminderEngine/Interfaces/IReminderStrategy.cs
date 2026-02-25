using ChoRe.Data;

public interface IReminderStrategy
{
    Task ExecuteAsync(AppDbContext context, IServiceProvider serviceProvider, CancellationToken token);
}