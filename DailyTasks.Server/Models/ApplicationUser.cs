namespace DailyTasks.Server.Models
{
    using Microsoft.AspNetCore.Identity;
    using System;

    public class ApplicationUser : IdentityUser
    {
        public string DisplayName { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset ChangedAt { get; set; }

        public string Picture { get; set; }
    }
}