namespace DailyTasks.Server.Handlers.Auth
{
	using DailyTasks.Server.Models;
	using FluentValidation;
	using IdentityServer4.Services;
	using MediatR;
	using Microsoft.AspNetCore.Identity;
	using Microsoft.Extensions.Configuration;
	using System.Threading;
	using System.Threading.Tasks;
	using System.Web;

	public class Login
	{
		public class Query : IRequest<bool>
		{
			public string Email { get; set; }

			public string Password { get; set; }

			public string ReturnUrl { get; set; }

			public bool RememberMe { get; set; }
		}

		public class Dto
		{
			public bool Succeeded { get; set; }

			public string ReturnUrl { get; set; }
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
					.EmailAddress()
					.NotEmpty();

				RuleFor(e => e.Password)
					.NotEmpty();

				RuleFor(e => e.ReturnUrl)
					.NotEmpty();
			}
		}

		public class QueryHandler : IRequestHandler<Query, bool>
		{
			private readonly QueryValidator _validator;
			private readonly SignInManager<ApplicationUser> _signInManager;

			public QueryHandler(QueryValidator validator, SignInManager<ApplicationUser> signInManager)
			{
				_validator = validator;
				_signInManager = signInManager;
			}

			public async Task<bool> Handle(Query request, CancellationToken cancellationToken)
			{
				await _validator.ValidateAndThrowAsync(request);

				var result = await _signInManager.PasswordSignInAsync(request.Email, request.Password, request.RememberMe, lockoutOnFailure: true);

				return result.Succeeded;
			}
		}
	}
}