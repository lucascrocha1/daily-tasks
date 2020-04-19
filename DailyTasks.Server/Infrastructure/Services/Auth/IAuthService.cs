namespace DailyTasks.Server.Infrastructure.Services.Auth
{
	using System.Security.Claims;
	using System.Threading.Tasks;

	public interface IAuthService
	{
		ClaimsIdentity GenerateClaimsIdentity(string id, string userName);

		string GenerateEncodedToken(string userName, ClaimsIdentity identity, bool rememberMe);
	}
}