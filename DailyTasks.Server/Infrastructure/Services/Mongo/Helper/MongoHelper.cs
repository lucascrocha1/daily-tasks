namespace DailyTasks.Server.Infrastructure.Services.Mongo.Helper
{
    using MongoDB.Driver;
    using System.Linq;
    using System.Threading.Tasks;

    public static class MongoHelper
    {
        public static async Task<bool> CheckCollectionExists(string collectionName, IMongoDatabase database)
        {
            var collections = await database.ListCollectionNamesAsync();

            var collectionNames = collections.ToList();

            if (collectionNames.Any(e => e == collectionName))
                return true;

            return false;
        }
    }
}