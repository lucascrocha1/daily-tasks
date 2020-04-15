namespace DailyTasks.Server.Infrastructure.Contexts
{
	using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
	using Microsoft.EntityFrameworkCore;

	public class AuthContext : IdentityDbContext
	{
		public AuthContext(DbContextOptions<AuthContext> options) : base(options) { }
	}
}