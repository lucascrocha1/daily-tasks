namespace DailyTasks.Server.Controllers
{
	using MediatR;
	using Microsoft.AspNetCore.Mvc;

    public class TaskController : Controller
    {
        private readonly IMediator _mediator;

        public TaskController(IMediator mediator)
        {
            _mediator = mediator;
        }


    }
}