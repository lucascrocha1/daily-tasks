namespace DailyTasks.Server.Handlers.Task
{
    using DailyTasks.Server.Infrastructure;
    using DailyTasks.Server.Models;
    using MediatR;
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;

    public class Get
    {
        public class Query : IRequest<Dto>
        {
            public int Id { get; set; }
        }

        public class Dto
        {
            public int Id { get; set; }

            public string Title { get; set; }

            public string Description { get; set; }

            public DateTimeOffset Date { get; set; }

            public CommentsDto[] Comments { get; set; }

            public DailyTaskStateEnum State { get; set; }

            public ChecklistDto[] Checklists { get; set; }
        }

        public class ChecklistDto
        {
            public int Id { get; set; }

            public bool Done { get; set; }

            public string Description { get; set; }
        }

        public class CommentsDto
        {
            public int Id { get; set; }

            public string Comment { get; set; }

            public string CreatedBy { get; set; }

            public DateTimeOffset CreatedAt { get; set; }
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
                    .Set<DailyTask>()
                    .AsNoTracking()
                    .Where(e => e.Id == request.Id)
                    .Select(e => new Dto
                    {
                        Id = e.Id,
                        Date = e.Date,
                        Title = e.Title,
                        State = e.State,
                        Description = e.Description,
                        Comments = e.Comments.Select(g => new CommentsDto
                            {
                                Id = g.Id,
                                Comment = g.Comment,
                                CreatedAt = g.CreatedAt,
                                CreatedBy = g.CreatedBy
                            })
                            .ToArray(),
                        Checklists = e.Checklists.Select(g => new ChecklistDto
                            {
                                Id = g.Id,
                                Done = g.Done,
                                Description = g.Description
                            })
                            .ToArray()
                    })
                    .FirstOrDefaultAsync();
            }
        }
    }
}