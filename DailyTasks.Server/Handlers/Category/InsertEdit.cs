namespace DailyTasks.Server.Handlers.Category
{
    using DailyTasks.Server.Infrastructure;
    using DailyTasks.Server.Infrastructure.Services.User;
    using DailyTasks.Server.Models;
    using MediatR;
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;

    public class InsertEdit
    {
        public class Command : IRequest
        {
            public int? Id { get; set; }

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
                Category category;

                var userId = _userService.GetUserId();

                if (!request.Id.HasValue)
                {
                    category = new Category
                    {
                        CreatedBy = userId,
                        CreatedAt = DateTimeOffset.Now
                    };

                    await _context.AddAsync(category);
                }
                else
                    category = await GetCategory(request.Id.Value);

                MapChanges(category, request, userId);

                await _context.SaveChangesAsync();
            }

            private void MapChanges(Category category, Command request, string userId)
            {
                category.ChangedBy = userId;
                category.ChangedAt = DateTimeOffset.Now;
                category.Description = request.Description;
            }

            private async Task<Category> GetCategory(int id)
            {
                return await _context
                    .Set<Category>()
                    .Where(e => e.Id == id)
                    .FirstOrDefaultAsync();
            }
        }
    }
}