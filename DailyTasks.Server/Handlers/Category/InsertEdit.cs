namespace DailyTasks.Server.Handlers.Category
{
	using DailyTasks.Server.Models;
	using DailyTasks.Server.Infrastructure;
    using MediatR;
    using System.Threading;
    using System.Threading.Tasks;
	using DailyTasks.Server.Infrastructure.Services.User;

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

                if (!request.Id.HasValue)
                {
                    category = new Category
                    {

                    };
                }
            }
        }
    }
}