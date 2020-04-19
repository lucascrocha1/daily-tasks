namespace DailyTasks.Server.Handlers.Auth
{
	using DailyTasks.Server.Infrastructure.Services.Auth;
	using DailyTasks.Server.Models;
	using FluentValidation;
	using MediatR;
	using Microsoft.AspNetCore.Identity;
	using System;
	using System.Threading;
	using System.Threading.Tasks;

	public class Login
	{
		public class Query : IRequest<string>
		{
			public string Email { get; set; }

			public string Password { get; set; }

			public bool RememberMe { get; set; }
		}

		public class QueryValidator : AbstractValidator<Query>
		{
			public QueryValidator()
			{
				Validate();
			}

			private void Validate()
			{
				RuleFor(e => e.Email)
					.NotEmpty()
					.EmailAddress();

				RuleFor(e => e.Password)
					.NotEmpty();
			}
		}

		public class QueryHandler : IRequestHandler<Query, string>
		{
			private readonly IAuthService _authService;
			private readonly QueryValidator _validator;
			private readonly UserManager<ApplicationUser> _userManager;

			public QueryHandler(IAuthService authService, QueryValidator validator, UserManager<ApplicationUser> userManager)
			{
				_authService = authService;
				_validator = validator;
				_userManager = userManager;
			}

			public async Task<string> Handle(Query request, CancellationToken cancellationToken)
			{
				await _validator.ValidateAndThrowAsync(request);

				var user = await _userManager.FindByEmailAsync(request.Email);

				if (user == null)
					throw new Exception();

				var passwordIsValid = await _userManager.CheckPasswordAsync(user, request.Password);

				if (!passwordIsValid)
					throw new Exception();

				var claims = _authService.GenerateClaimsIdentity(user.Id, user.UserName);

				return _authService.GenerateEncodedToken(user.UserName, claims, request.RememberMe);
			}
		}
	}
}
