namespace DailyTasks.Server.Infrastructure.Services.Email.Dto
{
    public class SendgridConfigurationDto
    {
        public string Key { get; set; }

        public string EmailFrom { get; set; }

        public string NameFrom { get; set; }
    }
}