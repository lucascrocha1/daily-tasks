namespace DailyTasks.Server.Models
{
    using System;
	using System.Collections.Generic;

	public class DailyTaskComment
    {
        public int Id { get; set; }

        public string Comment { get; set; }

        public string CreatedBy { get; set; }

        public int DailyTaskId { get; set; }

        public DailyTask DailyTask { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public List<DailyTaskCommentAttachment> Attachments { get; set; }
    }
}