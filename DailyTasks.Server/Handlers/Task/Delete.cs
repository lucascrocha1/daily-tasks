namespace DailyTasks.Server.Handlers.Task
{
    using DailyTasks.Server.Infrastructure.Contexts;
    using DailyTasks.Server.Models;
    using MediatR;
    using Microsoft.EntityFrameworkCore;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;

    public class Delete
    {
        public class Command : IRequest
        {
            public int Id { get; set; }
        }

        public class CommandHandler : AsyncRequestHandler<Command>
        {
            private readonly DailyTaskContext _context;

            public CommandHandler(DailyTaskContext context)
            {
                _context = context;
            }

            protected override async Task Handle(Command request, CancellationToken cancellationToken)
            {
                var dailyTask = await GetDailyTask(request.Id);

                if (dailyTask == null)
                    return;

                _context.Remove(dailyTask);

                await _context.SaveChangesAsync();
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