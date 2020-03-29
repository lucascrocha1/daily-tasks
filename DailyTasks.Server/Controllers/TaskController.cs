namespace DailyTasks.Server.Controllers
{
	using DailyTasks.Server.Handlers.Task;
	using MediatR;
	using Microsoft.AspNetCore.Mvc;
	using System.Threading.Tasks;

    [ApiController]
    [Route("api/[controller]")]
	public class TaskController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TaskController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> List([FromQuery]List.Query query)
        {
            var result = await _mediator.Send(query);

            return new JsonResult(result);
        }

        [HttpPost]
        public async Task Insert([FromBody]InsertEdit.Command command)
        {
            await _mediator.Send(command);
        }

        [HttpPut]
        public async Task Edit([FromBody]InsertEdit.Command command)
        {
            await _mediator.Send(command);
        }
    }
}