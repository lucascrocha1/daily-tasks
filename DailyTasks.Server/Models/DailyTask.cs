namespace DailyTasks.Server.Models
{
	using MongoDB.Bson;
	using MongoDB.Bson.Serialization.Attributes;
	using System;
	using System.Collections.Generic;

    public class DailyTask
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Description { get; set; }

        public DailyTaskStateEnum State { get; set; }

        public DateTime Date { get; set; }

        public List<DailyTaskItem> Items { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset ChangedAt { get; set; }
    }
}