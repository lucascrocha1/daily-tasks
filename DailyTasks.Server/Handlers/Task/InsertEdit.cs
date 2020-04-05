namespace DailyTasks.Server.Handlers.Task
{
    using DailyTasks.Server.Infrastructure;
    using DailyTasks.Server.Infrastructure.Services.File;
    using DailyTasks.Server.Infrastructure.Services.User;
    using DailyTasks.Server.Models;
    using FluentValidation;
    using MediatR;
    using Microsoft.AspNetCore.Http;
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;

    public class InsertEdit
    {
        public class Command : IRequest
        {
            public int? Id { get; set; }

            public string Title { get; set; }

            public string Description { get; set; }

            public DateTimeOffset Date { get; set; }

            public DailyTaskStateEnum State { get; set; }

            public ChecklistDto[] Checklists { get; set; }

            public AttachmentDto[] Attachments { get; set; }
        }

        public class ChecklistDto
        {
            public int? Id { get; set; }

            public bool Done { get; set; }

            public string Description { get; set; }
        }

        public class AttachmentDto
        {
            public int? Id { get; set; }

            public string FileBase64 { get; set; }

            public string FileName { get; set; }

            public string Link { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                Validate();
            }

            private void Validate()
            {
                RuleFor(e => e.Date)
                    .NotEmpty();

                RuleFor(e => e.Description)
                    .NotEmpty();

                RuleFor(e => e.State)
                    .NotEmpty();

                RuleFor(e => e.Title)
                    .NotEmpty();

                RuleFor(e => e.Checklists)
                    .NotEmpty()
                    .Must(ChecklistValid);
            }

            private bool ChecklistValid(ChecklistDto[] checklists)
            {
                if (checklists == null || checklists.Count() == 0)
                    return false;

                var checklistsWithDescription = checklists.Where(e => !string.IsNullOrEmpty(e.Description));

                if (checklistsWithDescription.Any())
                    return true;

                return false;
            }
        }

        public class CommandHandler : AsyncRequestHandler<Command>
        {
            private readonly DailyTaskContext _context;
            private readonly IUserService _userService;
            private readonly CommandValidator _validator;
            private readonly IFileService _fileService;

            public CommandHandler(DailyTaskContext context, IUserService userService, CommandValidator validator, IFileService fileService)
            {
                _context = context;
                _userService = userService;
                _validator = validator;
                _fileService = fileService;
            }

            protected override async Task Handle(Command request, CancellationToken cancellationToken)
            {
                await _validator.ValidateAndThrowAsync(request);

                var userId = _userService.GetUserId();

                DailyTask dailyTask;

                if (!request.Id.HasValue)
                {
                    dailyTask = new DailyTask
                    {
                        CreatedAt = DateTimeOffset.Now,
                        CreatedBy = userId
                    };

                    await _context.AddAsync(dailyTask);
                }
                else
                    dailyTask = await GetDailyTask(request.Id.Value);

                if (dailyTask == null)
                    throw new ValidationException("Daily task não encontrada");

                MapChanges(dailyTask, request, userId);

                MapChecklist(dailyTask, request, userId);

                await MapAttachment(dailyTask, request, userId);

                await _context.SaveChangesAsync();
            }

            private async Task<DailyTask> GetDailyTask(int id)
            {
                return await _context
                    .Set<DailyTask>()
                    .Include(e => e.Checklists)
                    .Include(e => e.Attachments)
                    .Where(e => e.Id == id)
                    .FirstOrDefaultAsync();
            }

            private void MapChanges(DailyTask dailyTask, Command request, string userId)
            {
                dailyTask.Title = request.Title;
                dailyTask.State = request.State;
                dailyTask.ChangedBy = userId;
                dailyTask.ChangedAt = DateTimeOffset.Now;
                dailyTask.Description = request.Description;
                dailyTask.Date = request.Date.StartOfTheDay();
            }

            private void MapChecklist(DailyTask dailyTask, Command request, string userId)
            {
                if (dailyTask.Checklists == null)
                    dailyTask.Checklists = new List<DailyTaskChecklist>();

                request.Checklists = request.Checklists.Where(e => !string.IsNullOrEmpty(e.Description)).ToArray();

                var requestTaskItemIds = request.Checklists.Select(e => e.Id).Where(e => e.HasValue);

                var removedIds = dailyTask.Checklists.Where(e => !requestTaskItemIds.Contains(e.Id)).Select(e => e.Id);

                dailyTask.Checklists = dailyTask.Checklists.Where(e => !removedIds.Contains(e.Id)).ToList();

                var inserted = request.Checklists.Where(e => !e.Id.HasValue || e.Id < 0);

                foreach (var item in inserted)
                {
                    dailyTask.Checklists.Add(new DailyTaskChecklist
                    {
                        Done = item.Done,
                        ChangedAt = DateTimeOffset.Now,
                        CreatedAt = DateTimeOffset.Now,
                        Description = item.Description,
                        CreatedBy = userId
                    });
                }

                var dailyTaskItemsIds = dailyTask.Checklists.Select(e => e.Id);

                var updated = request.Checklists.Where(e => e.Id.HasValue && dailyTaskItemsIds.Contains(e.Id.Value));

                foreach (var item in updated)
                {
                    var dailyTaskItem = dailyTask.Checklists.FirstOrDefault(e => e.Id == item.Id);

                    dailyTaskItem.Done = item.Done;
                    dailyTaskItem.ChangedBy = userId;
                    dailyTaskItem.Description = item.Description;
                    dailyTaskItem.ChangedAt = DateTimeOffset.Now;
                }
            }

            private async Task MapAttachment(DailyTask dailyTask, Command request, string userId)
            {
                if (dailyTask.Attachments == null)
                    dailyTask.Attachments = new List<DailyTaskAttachment>();

                var attachmentIds = request.Attachments.Where(e => e.Id.HasValue).Select(e => e.Id);

                var removed = dailyTask.Attachments.Where(e => !attachmentIds.Contains(e.Id));

                foreach (var attachment in removed)
                    await _fileService.RemoveFile(attachment.FilePath);

                dailyTask.Attachments = dailyTask.Attachments.Where(e => !removed.Select(g => g.Id).Contains(e.Id)).ToList();

                var inserted = request.Attachments.Where(e => !e.Id.HasValue);

                foreach (var attachment in inserted)
                {
                    var filePath = await _fileService.CreateAndSaveFile(attachment.FileName, attachment.FileBase64);

                    dailyTask.Attachments.Add(new DailyTaskAttachment
                    {
                        CreatedBy = userId,
                        FilePath = filePath,
                        Link = attachment.Link,
                        CreatedAt = DateTimeOffset.Now,
                        FileName = attachment.FileName
                    });
                }

                var dailyTaskAttachmentIds = dailyTask.Attachments.Select(e => e.Id);

                var updated = request.Attachments.Where(e => e.Id.HasValue && dailyTaskAttachmentIds.Contains(e.Id.Value));

                foreach (var newAttachment in updated)
                {
                    var originalAttachment = dailyTask.Attachments.FirstOrDefault(e => e.Id == newAttachment.Id);

                    if (!string.IsNullOrEmpty(originalAttachment.FilePath) && !string.IsNullOrEmpty(newAttachment.FileBase64))
                    {
                        await _fileService.RemoveFile(originalAttachment.FilePath);

                        originalAttachment.FileName = newAttachment.FileName;
                        originalAttachment.FilePath = await _fileService.CreateAndSaveFile(newAttachment.FileName, newAttachment.FileBase64);
                    }

                    originalAttachment.ChangedBy = userId;
                    originalAttachment.Link = newAttachment.Link;
                    originalAttachment.ChangedAt = DateTimeOffset.Now;
                }
            }
        }
    }
}