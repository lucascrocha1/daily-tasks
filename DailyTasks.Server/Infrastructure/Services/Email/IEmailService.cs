namespace DailyTasks.Server.Infrastructure.Services.Email
{
    using System.Threading.Tasks;

    public interface IEmailService
    {
        Task Send(string email, string body, string subject, string name = null);
    }
}