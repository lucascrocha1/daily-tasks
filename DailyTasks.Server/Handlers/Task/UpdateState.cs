namespace DailyTasks.Server.Handlers.Task
{
    using DailyTasks.Server.Infrastructure;
    using DailyTasks.Server.Infrastructure.Services.User;
    using DailyTasks.Server.Models;
    using MediatR;
    using Microsoft.EntityFrameworkCore;
    using System;
	using System.ComponentModel.DataAnnotations;
	using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;

    public class UpdateState
    {
        public class Command : IRequest
        {
            public int Id { get; set; }

            public DailyTaskStateEnum State { get; set; }
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
                var dailyTask = await GetDailyTask(request.Id);

                if (dailyTask == null)
                    throw new ValidationException(string.Empty);

                var userId = _userService.GetUserId();

                MapChanges(dailyTask, request, userId);

                await _context.SaveChangesAsync();
            }

            private void MapChanges(DailyTask dailyTask, Command request, string userId)
            {
                dailyTask.ChangedBy = userId;
                dailyTask.State = request.State;
                dailyTask.ChangedAt = DateTimeOffset.Now;
            }

            private async Task<DailyTask> GetDailyTask(int id)
            {
                return await _context
                    .Set<DailyTask>()
                    .Where(e => e.Id == id)
                    .FirstOrDefaultAsync();
            }
        }
    }
}