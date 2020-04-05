namespace DailyTasks.Server.Handlers.Task
{
    using DailyTasks.Server.Infrastructure;
    using DailyTasks.Server.Infrastructure.Services.File;
    using DailyTasks.Server.Infrastructure.Services.User;
    using DailyTasks.Server.Models;
    using FluentValidation;
    using MediatR;
    using Microsoft.AspNetCore.Http;
    using System;
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;

    public class AddComment
    {
        public class Command : IRequest
        {
            public int DailyTaskId { get; set; }

            public string Comment { get; set; }

            public IFormFile[] Attachments { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                Validate();
            }

            private void Validate()
            {
                RuleFor(e => e.Comment)
                    .NotEmpty();
            }
        }

        public class CommandHandler : AsyncRequestHandler<Command>
        {
            private readonly IFileService _fileService;
            private readonly IUserService _userService;
            private readonly DailyTaskContext _context;
            private readonly CommandValidator _validator;

            public CommandHandler(IFileService fileService, IUserService userService, DailyTaskContext context, CommandValidator validator)
            {
                _fileService = fileService;
                _userService = userService;
                _context = context;
                _validator = validator;
            }

            protected override async Task Handle(Command request, CancellationToken cancellationToken)
            {
                await _validator.ValidateAndThrowAsync(request);

                var userId = _userService.GetUserId();

                var comment = new DailyTaskComment
                {
                    CreatedBy = userId,
                    Comment = request.Comment,
                    CreatedAt = DateTimeOffset.Now,
                    DailyTaskId = request.DailyTaskId,
                    Attachments = new List<DailyTaskCommentAttachment>()
                };

                await MapFiles(comment, request);

                await _context.AddAsync(comment);

                await _context.SaveChangesAsync();
            }

            private async Task MapFiles(DailyTaskComment comment, Command request)
            {
                foreach (var file in request.Attachments)
                {
                    var filePath = await _fileService.SaveFile(file);

                    comment.Attachments.Add(new DailyTaskCommentAttachment
                    {
                        FileName = file.Name,
                        FilePath = filePath
                    });
                }
            }
        }
    }
}