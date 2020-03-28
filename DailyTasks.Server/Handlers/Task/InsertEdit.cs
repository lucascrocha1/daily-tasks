namespace DailyTasks.Server.Handlers.Task
{
	using DailyTasks.Server.Infrastructure;
	using DailyTasks.Server.Infrastructure.Services.Mongo.Connection;
	using DailyTasks.Server.Infrastructure.Services.Mongo.Helper;
	using MediatR;
    using MongoDB.Driver;
    using System;
    using System.Threading;
    using System.Threading.Tasks;

    public class InsertEdit
    {
        public class Command : IRequest
        {
            public string Id { get; set; }

            public string Description { get; set; }

            public DateTime Date { get; set; }

            public TaskItemsDto[] TaskItems { get; set; }
        }

        public class TaskItemsDto
        {
            public string Id { get; set; }

            public string Description { get; set; }

            public bool Done { get; set; }
        }

        public class CommandHandler : AsyncRequestHandler<Command>
        {
            private readonly IMongoConnection _mongoConnection;
            private readonly MongoHelper<Task> _mongoHelper;

            public CommandHandler(IMongoConnection mongoConnection, MongoHelper<Task> mongoHelper)
            {
                _mongoConnection = mongoConnection;
                _mongoHelper = mongoHelper;
            }

            protected override async Task Handle(Command request, CancellationToken cancellationToken)
            {
                var database = _mongoConnection.GetDatabase();

                var collectionExists = await _mongoHelper.CheckCollectionExists();

                if (!collectionExists)
                {

                }
            }
        }
    }
}