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
        [Route("Get")]
        public async Task<IActionResult> Get([FromQuery]Get.Query query)
        {
            var result = await _mediator.Send(query);

            return new JsonResult(result);
        }

        [HttpGet]
        [Route("List")]
        public async Task<IActionResult> List([FromQuery]List.Query query)
        {
            var result = await _mediator.Send(query);

            return new JsonResult(result);
        }

        [HttpPost]
        [Route("Insert")]
        public async Task Insert([FromBody]InsertEdit.Command command)
        {
            await _mediator.Send(command);
        }

        [HttpPut]
        [Route("Edit")]
        public async Task Edit([FromBody]InsertEdit.Command command)
        {
            await _mediator.Send(command);
        }

        [HttpPost]
        [Route("Delete")]
        public async Task Delete([FromBody]Delete.Command command)
        {
            await _mediator.Send(command);
        }
    }
}