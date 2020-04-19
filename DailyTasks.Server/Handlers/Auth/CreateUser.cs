namespace DailyTasks.Server.Handlers.Auth
{
    using DailyTasks.Server.Infrastructure.Services.Email;
    using DailyTasks.Server.Infrastructure.Services.File;
    using DailyTasks.Server.Models;
    using FluentValidation;
    using MediatR;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.Configuration;
    using System;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Web;

    public class CreateUser
    {
        public class Command : IRequest
        {
            public string Name { get; set; }

            public string Email { get; set; }

            public string Picture { get; set; }

            public string Password { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            private readonly UserManager<ApplicationUser> _userManager;

            public CommandValidator(UserManager<ApplicationUser> userManager)
            {
                _userManager = userManager;

                Validate();
            }

            private void Validate()
            {
                RuleFor(e => e.Name)
                    .NotEmpty();

                RuleFor(e => e.Password)
                    .NotEmpty()
                    .MinimumLength(8)
                    .Must(PasswordValid);

                RuleFor(e => e.Email)
                    .NotEmpty()
                    .EmailAddress()
                    .MustAsync(UniqueEmail)
                    .When(e => !string.IsNullOrEmpty(e.Email));
            }

            private async Task<bool> UniqueEmail(string email, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByEmailAsync(email);

                if (user == null)
                    return true;

                return false;
            }

            private bool PasswordValid(string password)
            {
                if (password.Any(e => char.IsDigit(e))
                    && password.Any(e => char.IsLetter(e))
                    && password.Any(e => char.IsUpper(e))
                    && password.Any(e => char.IsLower(e))
                    && !password.All(e => char.IsLetterOrDigit(e)))
                    return true;

                return false;
            }
        }

        public class CommandHandler : AsyncRequestHandler<Command>
        {
            private readonly CommandValidator _validator;
            private readonly UserManager<ApplicationUser> _userManager;
            private readonly IFileService _fileService;
            private readonly IEmailService _emailService;
            private readonly IConfiguration _configuration;

            public CommandHandler(CommandValidator validator, UserManager<ApplicationUser> userManager, IFileService fileService, IEmailService emailService, IConfiguration configuration)
            {
                _validator = validator;
                _userManager = userManager;
                _fileService = fileService;
                _emailService = emailService;
                _configuration = configuration;
            }

            protected override async Task Handle(Command request, CancellationToken cancellationToken)
            {
                await _validator.ValidateAndThrowAsync(request);

                var user = GetUser(request);

                if (!string.IsNullOrEmpty(request.Picture))
                {
                    var pictureName = $@"{user.DisplayName}-{Guid.NewGuid()}";

                    user.Picture = await _fileService.CreateAndSaveFile(pictureName, request.Picture);
                }

                var result = await _userManager.CreateAsync(user, request.Password);

                // ToDo: tratar isso
                if (!result.Succeeded)
                    throw new Exception();

                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                var body = GetBody(user.Email, token);

                await _emailService.Send(user.Email, body, "Confirm your email", user.DisplayName);
            }

            private string GetBody(string email, string token)
            {
                var baseUrl = _configuration["ConfirmEmailUrl"];

                var query = $"email={email}&token={token}";

                var url = HttpUtility.UrlEncode(baseUrl + query);

                return $@"<a href='{url}' target='_blank'>Please confirm your email clicking here</a>
                        <br/><br/>
                        <span>{url}</span>";
            }

            private ApplicationUser GetUser(Command request)
            {
                return new ApplicationUser
                {
                    Email = request.Email,
                    DisplayName = request.Name,
                    CreatedAt = DateTimeOffset.Now,
                    UserName = request.Email.ToLower()
                };
            }
        }
    }
}