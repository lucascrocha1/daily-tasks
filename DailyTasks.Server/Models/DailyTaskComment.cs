namespace DailyTasks.Server.Models
{
    using System;

    public class DailyTaskComment
    {
        public int Id { get; set; }

        public int DailyTaskId { get; set; }

        public DailyTask DailyTask { get; set; }

        public string CreatedBy { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public string Comment { get; set; }
    }
}