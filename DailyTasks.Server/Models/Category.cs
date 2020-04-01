namespace DailyTasks.Server.Models
{
    using System;
    using System.Collections.Generic;

    public class Category
    {
        public int Id { get; set; }

        public string CreatedBy { get; set; }

        public string ChangedBy { get; set; }

        public string Description { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset ChangedAt { get; set; }

        public List<DailyTask> DailyTasks { get; set; }
    }
}