namespace DailyTasks.Server.Handlers.Task
{
    using DailyTasks.Server.Infrastructure;
    using DailyTasks.Server.Infrastructure.Services.Mongo.Connection;
    using DailyTasks.Server.Models;
    using MediatR;
    using MongoDB.Driver;
	using System;
	using System.Threading;
    using System.Threading.Tasks;

    public class SetAllTasksDone
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
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

                var filter = Builders<DailyTask>.Filter.Eq(e => e.Id, request.Id);

                var task = await collection.FindAsync(filter);

                var dailyTask = await task.FirstOrDefaultAsync();

                if (dailyTask == null)
                    return;

                dailyTask.State = DailyTaskStateEnum.Closed;
                dailyTask.ChangedAt = DateTimeOffset.Now;

                if (dailyTask.Items != null)
                    foreach (var item in dailyTask.Items)
                        item.Done = true;

                await collection.ReplaceOneAsync(filter, dailyTask, new ReplaceOptions
                {
                    IsUpsert = true
                });
            }
        }
    }
}