namespace DailyTasks.Server.Models
{
    public class DailyTaskCommentAttachment
    {
        public int Id { get; set; }

        public string FileName { get; set; }

        public string FilePath { get; set; }

        public int DailyTaskCommentId { get; set; }

        public DailyTaskComment DailyTaskComment { get; set; }
    }
}