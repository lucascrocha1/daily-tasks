namespace DailyTasks.Server.Models
{
    using System;
    using System.Collections.Generic;

    public class DailyTask
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string CreatedBy { get; set; }

        public string ChangedBy { get; set; }

        public int? CategoryId { get; set; }

        public Category Category { get; set; }

        public string Description { get; set; }

        public DateTimeOffset Date { get; set; }

        public DailyTaskStateEnum State { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset ChangedAt { get; set; }

        public List<DailyTaskComment> Comments { get; set; }

        public List<DailyTaskChecklist> Checklists { get; set; }

        public List<DailyTaskAttachment> Attachments { get; set; }
    }
}