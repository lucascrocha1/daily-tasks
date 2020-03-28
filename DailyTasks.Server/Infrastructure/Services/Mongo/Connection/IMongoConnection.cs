namespace DailyTasks.Server.Infrastructure.Services.Mongo.Connection
{
    using MongoDB.Driver;

    public interface IMongoConnection
    {
        IMongoDatabase GetDatabase();
    }
}