namespace DailyTasks.Server.Models
{
	using MongoDB.Bson;
	using MongoDB.Bson.Serialization.Attributes;
	using System;

    public class DailyTaskItem
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Description { get; set; }

        public bool Done { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset ChangedAt { get; set; }
    }
}