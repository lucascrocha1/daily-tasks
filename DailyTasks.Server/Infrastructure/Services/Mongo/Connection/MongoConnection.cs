namespace DailyTasks.Server.Infrastructure.Services.Mongo.Connection
{
    using Microsoft.Extensions.Configuration;
	using MongoDB.Driver;

	public class MongoConnection : IMongoConnection
    {
        private readonly IConfiguration _configuration;

        public MongoConnection(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IMongoDatabase GetDatabase()
        {
            var connectionString = _configuration["MongoDb:Connection"];

            var databaseName = _configuration["MongoDb:Database"];

            var client = new MongoClient(connectionString);

            return client.GetDatabase(databaseName);
        }
    }
}