﻿namespace DailyTasks.Server.Handlers.Task
{
    using DailyTasks.Server.Infrastructure;
    using DailyTasks.Server.Infrastructure.Services.Mongo.Connection;
    using DailyTasks.Server.Infrastructure.Services.Mongo.Helper;
    using DailyTasks.Server.Models;
    using MediatR;
    using MongoDB.Driver;
    using System;
	using System.Collections.Generic;
	using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;

    public class List
    {
        public class Query : IRequest<TaskDto[]>
        {
            public DateTimeOffset Date { get; set; }

            public DailyTaskStateEnum? State { get; set; }
        }

        public class TaskDto
        {
            public string Id { get; set; }

            public DateTimeOffset CreatedAt { get; set; }

            public DateTimeOffset Date { get; set; }

            public string Title { get; set; }

            public DailyTaskStateEnum State { get; set; }

            public int QuantityTasks { get; set; }

            public int QuantityTasksDone { get; set; }

            public TaskItemDto[] TaskItems { get; set; }
        }

        public class TaskItemDto
        {
            public string Id { get; set; }

            public string Description { get; set; }

            public bool Done { get; set; }
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
                if (request.Date == default || request.Date == null)
                    request.Date = DateTimeOffset.Now;

                request.Date = request.Date.StartOfTheDay();

                var database = _mongoConnection.GetDatabase();

                var collectionExists = await MongoHelper.CheckCollectionExists(nameof(DailyTask).Pluralize(), database);

                if (!collectionExists)
                    return EmptyResult();

                var collection = database.GetCollection<DailyTask>(nameof(DailyTask).Pluralize());

                var filter = Builders<DailyTask>.Filter.Eq(e => e.Date, request.Date);

                var documents = await collection.FindAsync(filter);

                var dailyTasks = await documents.ToListAsync();

                if (dailyTasks.Count() == 0)
                    return EmptyResult();

                if (request.State.HasValue)
                    dailyTasks = dailyTasks.Where(e => e.State == request.State.Value).ToList();

                return dailyTasks
                    .Select(e => new TaskDto
                    {
                        Id = e.Id,
                        State = e.State,
                        Date = e.Date,
                        CreatedAt = e.CreatedAt,
                        Title = e.Title,
                        QuantityTasks = e.Items.Count(),
                        QuantityTasksDone = e.Items.Where(g => g.Done).Count(),
                        TaskItems = e.Items
                            .Select(g => new TaskItemDto
                            {
                                Id = g.Id,
                                Done = g.Done,
                                Description = g.Description
                            })
                            .ToArray()
                    })
                    .ToArray();
            }

            private TaskDto[] EmptyResult()
            {
                return new List<TaskDto>().ToArray();
            }
        }
    }
}