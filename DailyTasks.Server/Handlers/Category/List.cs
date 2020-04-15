namespace DailyTasks.Server.Handlers.Category
{
    using DailyTasks.Server.Infrastructure.Contexts;
    using DailyTasks.Server.Models;
    using MediatR;
	using Microsoft.EntityFrameworkCore;
	using System;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;

    public class List
    {
        public class Query : IRequest<Dto[]>
        {
            public int PageSize { get; set; }

            public int PageIndex { get; set; }
        }

        public class Dto
        {
            public int Id { get; set; }

            public string Description { get; set; }
        }

        public class QueryHandler : IRequestHandler<Query, Dto[]>
        {
            private readonly DailyTaskContext _context;

            public QueryHandler(DailyTaskContext context)
            {
                _context = context;
            }

            public async Task<Dto[]> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = ListCategories();

                query = query
                    .Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize);

                return await query.ToArrayAsync();
            }

            private IQueryable<Dto> ListCategories()
            {
                return _context
                    .Set<Category>()
                    .AsNoTracking()
                    .OrderByDescending(e => e.CreatedAt)
                    .Select(e => new Dto
                    {
                        Id = e.Id,
                        Description = e.Description
                    })
                    .AsQueryable();
            }
        }
    }
}
