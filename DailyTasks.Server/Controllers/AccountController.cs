namespace DailyTasks.Server.Controllers
{
	using Microsoft.AspNetCore.Mvc;
	using Microsoft.Extensions.Configuration;

	[ApiController]
	[Route("[controller]")]
	public class AccountController : ControllerBase
	{
		private readonly IConfiguration _configuration;

		public AccountController(IConfiguration configuration)
		{
			_configuration = configuration;
		}

		[HttpGet]
		[Route("Login")]
		public IActionResult Login(string returnUrl)
		{
			var authUrl = _configuration["AuthRedirectUri"];

			var redirectUrl = $"{authUrl}?returnUrl={returnUrl}";

			return Redirect(redirectUrl);
		}
	}
}