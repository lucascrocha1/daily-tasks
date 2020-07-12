namespace DailyTask.Server.Dominio
{
	using Microsoft.AspNetCore.Identity;

	public class Usuario : IdentityUser
	{
		public string Nome { get; set; }

		public string GoogleToken { get; set; }
	}
}