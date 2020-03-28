namespace DailyTasks.Server.Models
{
	using MongoDB.Bson;
	using MongoDB.Bson.Serialization.Attributes;
	using System;

    public class TaskItem
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Description { get; set; }

        public bool Done { get; set; }

        [BsonRepresentation(BsonType.DateTime)]
        public DateTimeOffset CreatedAt { get; set; }

        [BsonRepresentation(BsonType.DateTime)]
        public DateTimeOffset ChangedAt { get; set; }
    }
}