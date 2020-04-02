namespace DailyTasks.Server.Handlers.Task
{
    using DailyTasks.Server.Infrastructure;
    using DailyTasks.Server.Infrastructure.Services.User;
    using DailyTasks.Server.Models;
    using MediatR;
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;

    public class InsertEdit
    {
        public class Command : IRequest
        {
            public int? Id { get; set; }

            public string Title { get; set; }

            public string Description { get; set; }

            public DateTimeOffset Date { get; set; }

            public ChecklistDto[] Checklists { get; set; }

            public DailyTaskStateEnum State { get; set; }
        }

        public class ChecklistDto
        {
            public int? Id { get; set; }

            public bool Done { get; set; }

            public string Description { get; set; }
        }

        public class CommandHandler : AsyncRequestHandler<Command>
        {
            private readonly DailyTaskContext _context;
            private readonly IUserService _userService;

            public CommandHandler(DailyTaskContext context, IUserService userService)
            {
                _context = context;
                _userService = userService;
            }

            protected override async Task Handle(Command request, CancellationToken cancellationToken)
            {
                var userId = _userService.GetUserId();

                DailyTask dailyTask;

                if (!request.Id.HasValue)
                {
                    dailyTask = new DailyTask
                    {
                        CreatedAt = DateTimeOffset.Now,
                        CreatedBy = userId
                    };

                    await _context.AddAsync(dailyTask);
                }
                else
                    dailyTask = await GetDailyTask(request.Id.Value);

                if (dailyTask == null)
                    return;

                MapChanges(dailyTask, request, userId);

                await _context.SaveChangesAsync();
            }

            private async Task<DailyTask> GetDailyTask(int id)
            {
                return await _context
                    .Set<DailyTask>()
                    .Include(e => e.Checklists)
                    .Where(e => e.Id == id)
                    .FirstOrDefaultAsync();
            }

            private void MapChanges(DailyTask dailyTask, Command request, string userId)
            {
                dailyTask.Title = request.Title;
                dailyTask.State = request.State;
                dailyTask.ChangedBy = userId;
                dailyTask.ChangedAt = DateTimeOffset.Now;
                dailyTask.Description = request.Description;
                dailyTask.Date = request.Date.StartOfTheDay();

                if (dailyTask.Checklists == null)
                    dailyTask.Checklists = new List<DailyTaskChecklist>();

                request.Checklists = request.Checklists.Where(e => !string.IsNullOrEmpty(e.Description)).ToArray();

                var requestTaskItemIds = request.Checklists.Select(e => e.Id).Where(e => e.HasValue);

                var removedIds = dailyTask.Checklists.Where(e => !requestTaskItemIds.Contains(e.Id)).Select(e => e.Id);

                dailyTask.Checklists = dailyTask.Checklists.Where(e => !removedIds.Contains(e.Id)).ToList();

                var inserted = request.Checklists.Where(e => !e.Id.HasValue);

                foreach (var item in inserted)
                {
                    dailyTask.Checklists.Add(new DailyTaskChecklist
                    {
                        Done = item.Done,
                        ChangedAt = DateTimeOffset.Now,
                        CreatedAt = DateTimeOffset.Now,
                        Description = item.Description,
                    });
                }

                var dailyTaskItemsIds = dailyTask.Checklists.Select(e => e.Id);

                var updated = request.Checklists.Where(e => e.Id.HasValue && dailyTaskItemsIds.Contains(e.Id.Value));

                foreach (var item in updated)
                {
                    var dailyTaskItem = dailyTask.Checklists.FirstOrDefault(e => e.Id == item.Id);

                    dailyTaskItem.Description = item.Description;
                    dailyTaskItem.Done = item.Done;
                    dailyTaskItem.ChangedAt = DateTimeOffset.Now;
                }
            }
        }
    }
}