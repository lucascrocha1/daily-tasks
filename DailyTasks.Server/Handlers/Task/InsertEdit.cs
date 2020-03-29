namespace DailyTasks.Server.Handlers.Task
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

    public class InsertEdit
    {
        public class Command : IRequest
        {
            public string Id { get; set; }

            public string Description { get; set; }

            public DateTime Date { get; set; }

            public TaskItemsDto[] TaskItems { get; set; }

            public DailyTaskStateEnum State { get; set; }
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

            public CommandHandler(IMongoConnection mongoConnection)
            {
                _mongoConnection = mongoConnection;
            }

            protected override async Task Handle(Command request, CancellationToken cancellationToken)
            {
                var database = _mongoConnection.GetDatabase();

                var collectionExists = await MongoHelper.CheckCollectionExists(nameof(DailyTask).Pluralize(), database);

                if (!collectionExists)
                    await database.CreateCollectionAsync(nameof(DailyTask).Pluralize());

                var collection = database.GetCollection<DailyTask>(nameof(DailyTask).Pluralize());

                var filter = Builders<DailyTask>.Filter.Eq(e => e.Id, request.Id);

                var task = await collection.FindAsync(filter);

                var dailyTask = await task.FirstOrDefaultAsync();

                if (dailyTask != null)
                {
                    MapChanges(dailyTask, request);

                    await UpdateDocument(filter, dailyTask, collection, request);
                }
                else
                {
                    await collection.InsertOneAsync(CreateDailyTask(request));
                }
            }

            private DailyTask CreateDailyTask(Command request)
            {
                var dailyTask = new DailyTask
                {
                    ChangedAt = DateTimeOffset.Now,
                    CreatedAt = DateTimeOffset.Now,
                    Date = request.Date.StartOfTheDay(),
                    Description = request.Description,
                    State = DailyTaskStateEnum.New,
                    Items = new List<DailyTaskItem>()
                };

                foreach (var item in request.TaskItems)
                {
                    dailyTask.Items.Add(new DailyTaskItem
                    {
                        ChangedAt = DateTimeOffset.Now,
                        CreatedAt = DateTimeOffset.Now,
                        Description = item.Description,
                        Done = item.Done
                    });
                }

                return dailyTask;
            }

            private async Task UpdateDocument(FilterDefinition<DailyTask> filter, DailyTask dailyTask, IMongoCollection<DailyTask> collection, Command request)
            {
                await collection.ReplaceOneAsync(filter, dailyTask, new ReplaceOptions
                {
                    IsUpsert = true
                });
            }

            private void MapChanges(DailyTask dailyTask, Command request)
            {
                dailyTask.ChangedAt = DateTimeOffset.Now;
                dailyTask.Date = request.Date.StartOfTheDay();
                dailyTask.Description = request.Description;
                dailyTask.State = request.State;

                if (dailyTask.Items == null)
                    dailyTask.Items = new List<DailyTaskItem>();

                var inserted = request.TaskItems.Where(e => string.IsNullOrEmpty(e.Id));

                foreach (var item in inserted)
                {
                    dailyTask.Items.Add(new DailyTaskItem
                    {
                        ChangedAt = DateTimeOffset.Now,
                        CreatedAt = DateTimeOffset.Now,
                        Description = item.Description,
                        Done = item.Done
                    });
                }

                var dailyTaskItemsIds = dailyTask.Items.Select(e => e.Id);

                var updated = request.TaskItems.Where(e => dailyTaskItemsIds.Contains(e.Id));

                foreach (var item in updated)
                {
                    var dailyTaskItem = dailyTask.Items.FirstOrDefault(e => e.Id == item.Id);

                    dailyTaskItem.Description = item.Description;
                    dailyTaskItem.Done = item.Done;
                    dailyTaskItem.ChangedAt = DateTimeOffset.Now;
                }

                var removed = request.TaskItems.Where(e => !string.IsNullOrEmpty(e.Id) && !dailyTaskItemsIds.Contains(e.Id));

                foreach (var item in removed)
                {
                    var dailyTaskItem = dailyTask.Items.FirstOrDefault(e => e.Id == item.Id);

                    dailyTask.Items.Remove(dailyTaskItem);
                }
            }
        }
    }
}