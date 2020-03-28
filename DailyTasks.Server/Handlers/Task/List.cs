namespace DailyTasks.Server.Handlers.Task
{
	using DailyTasks.Server.Infrastructure.Services.Mongo.Connection;
	using DailyTasks.Server.Models;
	using MediatR;
	using System;
    using System.Threading;
    using System.Threading.Tasks;

    public class List
    {
        public class Query : IRequest<TaskDto[]>
        {
            public TaskStateEnum? State { get; set; }
        }

        public class TaskDto
        {
            public string Id { get; set; }

            public string Description { get; set; }

            public DateTimeOffset CreatedAt { get; set; }

            public int QuantityTasksDone { get; set; }
        }

        public class QueryHandler : IRequestHandler<Query, TaskDto[]>
        {
            private readonly IMongoConnection _mongoConnection;

            public QueryHandler(IMongoConnection mongoConnection)
            {
                _mongoConnection = mongoConnection;
            }

            public async Task<TaskDto[]> Handle(Query request, CancellationToken cancellationToken)
            {
                var database = _mongoConnection.GetDatabase();

                return null;
            }
        }
    }
}