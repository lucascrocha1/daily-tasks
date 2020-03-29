namespace DailyTasks.Server.Handlers.Task
{
    using DailyTasks.Server.Infrastructure;
    using DailyTasks.Server.Infrastructure.Services.Mongo.Connection;
    using DailyTasks.Server.Models;
    using MediatR;
    using MongoDB.Driver;
    using System.Threading;
    using System.Threading.Tasks;

    public class Delete
    {
        public class Command : IRequest
        {
            public string TaskId { get; set; }
        }

        public class CommandHandler : AsyncRequestHandler<Command>
        {
            private readonly IMongoConnection _mongoConnection;

            public CommandHandler(IMongoConnection mongoConnection)
            {
                _mongoConnection = mongoConnection;
            }

            protected override async Task Handle(Command request, CancellationToken cancellationToken)
            {
                var database = _mongoConnection.GetDatabase();

                var collection = database.GetCollection<DailyTask>(nameof(DailyTask).Pluralize());

                var filter = Builders<DailyTask>.Filter.Eq(e => e.Id, request.TaskId);

                await collection.DeleteOneAsync(filter);
            }
        }
    }
}
