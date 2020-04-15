namespace DailyTasks.Server.Handlers.Task
{
	using DailyTasks.Server.Infrastructure;
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
        public class Query : IRequest<DailyTaskDto[]>
        {
            public int PageSize { get; set; }

            public int PageIndex { get; set; }

            public int? CategoryId { get; set; }

            public DateTimeOffset Date { get; set; }

            public DailyTaskStateEnum? State { get; set; }
        }

        public class DailyTaskDto
        {
            public int Id { get; set; }

            public string Title { get; set; }

            public int? CategoryId { get; set; }

            public int QuantityTasks { get; set; }

            public DateTimeOffset Date { get; set; }

            public int QuantityTasksDone { get; set; }

            public DailyTaskStateEnum State { get; set; }

            public ChecklistDto[] Checklists { get; set; }

            public string CategoryDescription { get; set; }
        }

        public class ChecklistDto
        {
            public int Id { get; set; }

            public bool Done { get; set; }

            public string Description { get; set; }
        }

        public class QueryHandler : IRequestHandler<Query, DailyTaskDto[]>
        {
            private readonly DailyTaskContext _context;

            public QueryHandler(DailyTaskContext context)
            {
                _context = context;
            }

            public async Task<DailyTaskDto[]> Handle(Query request, CancellationToken cancellationToken)
            {
                if (request.Date == default || request.Date == null)
                    request.Date = DateTimeOffset.Now;

                request.Date = request.Date.StartOfTheDay();

                var query = GetDailyTaskQuery(request);

                if (request.CategoryId.HasValue)
                    query = query.Where(e => e.CategoryId == request.CategoryId.Value);

                if (request.State.HasValue)
                    query = query.Where(e => e.State == request.State);

                query = query
                    .Skip((request.PageIndex - 1) * request.PageSize)
                    .Take(request.PageSize);

                return await query.ToArrayAsync();
            }

            private IQueryable<DailyTaskDto> GetDailyTaskQuery(Query request)
            {
                return _context
                       .Set<DailyTask>()
                       .AsNoTracking()
                       .Where(e => e.Date == request.Date)
                       .Select(e => new DailyTaskDto
                       {
                           Id = e.Id,
                           Date = e.Date,
                           Title = e.Title,
                           State = e.State,
                           CategoryId = e.CategoryId,
                           QuantityTasks = e.Checklists.Count(),
                           CategoryDescription = e.Category.Description,
                           QuantityTasksDone = e.Checklists.Where(g => g.Done).Count(),
                           Checklists = e.Checklists
                               .Select(g => new ChecklistDto
                               {
                                   Id = g.Id,
                                   Done = g.Done,
                                   Description = g.Description
                               })
                               .ToArray()
                       })
                       .AsQueryable();
            }
        }
    }
}