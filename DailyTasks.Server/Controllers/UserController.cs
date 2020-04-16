namespace DailyTasks.Server.Controllers
{
    using DailyTasks.Server.Handlers.User;
    using MediatR;
    using Microsoft.AspNetCore.Mvc;
    using System.Threading.Tasks;

    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UserController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [Route("CreateUser")]
        public async Task CreateUser([FromBody]CreateUser.Command command)
        {
            await _mediator.Send(command);
        }
    }
}