namespace DailyTasks.Server.Infrastructure.Services.Mongo.Helper
{
    using DailyTasks.Server.Infrastructure.Services.Mongo.Connection;
    using MongoDB.Driver;
    using System.Linq;
    using System.Threading.Tasks;

    public class MongoHelper<T> where T : class
    {
        private readonly IMongoConnection _mongoConnection;

        public MongoHelper(IMongoConnection mongoConnection)
        {
            _mongoConnection = mongoConnection;
        }

        public async Task<bool> CheckCollectionExists()
        {
            var collectionName = nameof(T).Pluralize();

            var database = _mongoConnection.GetDatabase();

            var collections = await database.ListCollectionNamesAsync();

            var collectionNames = collections.ToList();

            if (collectionNames.Any(e => e == collectionName))
                return true;

            return false;
        }
    }
}