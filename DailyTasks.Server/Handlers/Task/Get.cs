namespace DailyTasks.Server.Handlers.Task
{
    using DailyTasks.Server.Infrastructure;
    using DailyTasks.Server.Infrastructure.Services.Mongo.Connection;
    using DailyTasks.Server.Models;
    using MediatR;
    using MongoDB.Driver;
    using System;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;

    public class Get
    {
        public class Query : IRequest<Dto>
        {
            public string Id { get; set; }
        }

        public class Dto
        {
            public string Id { get; set; }

            public string Description { get; set; }

            public DateTimeOffset Date { get; set; }

            public TaskItemsDto[] TaskItems { get; set; }

            public DailyTaskStateEnum State { get; set; }
        }

        public class TaskItemsDto
        {
            public string Id { get; set; }

            public string Description { get; set; }

            public bool Done { get; set; }
        }

        public class QueryHandler : IRequestHandler<Query, Dto>
        {
            private readonly IMongoConnection _mongoConnection;

            public QueryHandler(IMongoConnection mongoConnection)
            {
                _mongoConnection = mongoConnection;
            }

            public async Task<Dto> Handle(Query request, CancellationToken cancellationToken)
            {
                var database = _mongoConnection.GetDatabase();

                var collection = database.GetCollection<DailyTask>(nameof(DailyTask).Pluralize());

                var filter = Builders<DailyTask>.Filter.Eq(e => e.Id, request.Id);

                var document = await collection.FindAsync(filter);

                var dailyTask = await document.FirstOrDefaultAsync();

                if (dailyTask == null)
                    return null;

                return new Dto
                {
                    Id = dailyTask.Id,
                    Date = dailyTask.Date,
                    State = dailyTask.State,
                    Description = dailyTask.Description,
                    TaskItems = dailyTask.Items
                        .Select(e => new TaskItemsDto
                        {
                            Id = e.Id,
                            Done = e.Done,
                            Description = e.Description,
                        })
                        .ToArray()
                };
            }
        }
    }
}