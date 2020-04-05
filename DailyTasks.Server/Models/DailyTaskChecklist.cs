namespace DailyTasks.Server.Models
{
    using System;

    public class DailyTaskChecklist
    {
        public int Id { get; set; }

        public bool Done { get; set; }

        public int DailyTaskId { get; set; }

        public DailyTask DailyTask { get; set; }

        public string CreatedBy { get; set; }

        public string ChangedBy { get; set; }

        public string Description { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset ChangedAt { get; set; }
    }
}