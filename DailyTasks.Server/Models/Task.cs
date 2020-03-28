namespace DailyTasks.Server.Models
{
	using MongoDB.Bson;
	using MongoDB.Bson.Serialization.Attributes;
	using System;
	using System.Collections.Generic;

    public class Task
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Description { get; set; }

        [BsonRepresentation(BsonType.Int32)]
        public TaskStateEnum State { get; set; }

        public DateTime Date { get; set; }

        public List<TaskItem> Items { get; set; }

        [BsonRepresentation(BsonType.DateTime)]
        public DateTimeOffset CreatedAt { get; set; }

        [BsonRepresentation(BsonType.DateTime)]
        public DateTimeOffset ChangedAt { get; set; }
    }
}