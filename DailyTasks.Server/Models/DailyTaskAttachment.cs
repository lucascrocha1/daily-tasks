using System;

namespace DailyTasks.Server.Models
{
    public class DailyTaskAttachment
    {
        public int Id { get; set; }

        public string Link { get; set; }

        public string FileName { get; set; }

        public string FilePath { get; set; }

        public string CreatedBy { get; set; }

        public string ChangedBy { get; set; }

        public int DailyTaskId { get; set; }

        public DailyTask DailyTask { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset ChangedAt { get; set; }
    }
}