using Microsoft.AspNetCore.Mvc;

namespace DailyTask.Server.Controllers
{
	public class LoginController : Controller
	{
		[HttpGet]
		[Route("Login/Autenticar")]
		public IActionResult Autenticar(string token)
		{
			return null;
		}
	}
}