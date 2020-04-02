namespace DailyTasks.Server.Handlers.Category
{
    using DailyTasks.Server.Infrastructure;
    using MediatR;
    using System.Threading;
    using System.Threading.Tasks;
    using DailyTasks.Server.Models;
	using Microsoft.EntityFrameworkCore;
	using System.Linq;

	public class Get
    {
        public class Query : IRequest<Dto>
        {
            public int Id { get; set; }
        }

        public class Dto
        {
            public int Id { get; set; }

            public string Description { get; set; }
        }

        public class QueryHandler : IRequestHandler<Query, Dto>
        {
            private readonly DailyTaskContext _context;

            public QueryHandler(DailyTaskContext context)
            {
                _context = context;
            }

            public async Task<Dto> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context
                    .Set<Category>()
                    .AsNoTracking()
                    .Where(e => e.Id == request.Id)
                    .Select(e => new Dto
                    {
                        Id = e.Id,
                        Description = e.Description
                    })
                    .FirstOrDefaultAsync();
            }
        }
    }
}