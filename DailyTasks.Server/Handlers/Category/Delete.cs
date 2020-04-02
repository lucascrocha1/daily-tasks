namespace DailyTasks.Server.Handlers.Category
{
    using DailyTasks.Server.Infrastructure;
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
                var category = await GetDailyTask(request.Id);

                if (category == null)
                    return;

                if (category.DailyTasks.Any())
                    category.DailyTasks.ForEach(e => e.CategoryId = null);

                _context.Remove(category);

                await _context.SaveChangesAsync();
            }

            private async Task<Category> GetDailyTask(int id)
            {
                return await _context
                    .Set<Category>()
                    .Include(e => e.DailyTasks)
                    .Where(e => e.Id == id)
                    .FirstOrDefaultAsync();
            }
        }
    }
}