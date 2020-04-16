namespace DailyTasks.Server.Infrastructure.Services.Email
{
	using DailyTasks.Server.Infrastructure.Services.Email.Dto;
	using Microsoft.Extensions.Configuration;
	using Newtonsoft.Json;
	using SendGrid;
	using SendGrid.Helpers.Mail;
	using System.IO;
    using System.Threading.Tasks;

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task Send(string email, string body, string subject, string name = null)
        {
            var configuration = await GetSendgridConfiguration();

            var client = new SendGridClient(configuration.Key);

            var from = new EmailAddress(configuration.EmailFrom, configuration.NameFrom);

            var to = new EmailAddress(email, name);

            var msg = MailHelper.CreateSingleEmail(from, to, subject, body, body);

            await client.SendEmailAsync(msg);
        }

        private async Task<SendgridConfigurationDto> GetSendgridConfiguration()
        {
            var json = await File.ReadAllTextAsync(_configuration["SendgridConfigurationPath"]);

            return JsonConvert.DeserializeObject<SendgridConfigurationDto>(json);
        }
    }
}