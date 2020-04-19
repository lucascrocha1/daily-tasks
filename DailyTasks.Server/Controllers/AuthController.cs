namespace DailyTasks.Server.Controllers
{
	using DailyTasks.Server.Handlers.Auth;
	using MediatR;
	using Microsoft.AspNetCore.Mvc;
	using System.Threading.Tasks;

	[ApiController]
	[Route("api/[controller]")]
	public class AuthController : ControllerBase
	{
		private readonly IMediator _mediator;

		public AuthController(IMediator mediator)
		{
			_mediator = mediator;
		}

		[HttpPost]
		[Route("Login")]
		public async Task<IActionResult> Login([FromBody]Login.Query query)
		{
			var result = await _mediator.Send(query);

			return new JsonResult(result);
		}

		[HttpPost]
		[Route("CreateUser")]
		public async Task CreateUser([FromBody]CreateUser.Command command)
		{
			await _mediator.Send(command);
		}
	}
}