namespace DailyTasks.Server.Infrastructure.Contexts
{
    using DailyTasks.Server.Models;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
	using Microsoft.EntityFrameworkCore;

	public class AuthContext : IdentityDbContext<ApplicationUser>
	{
		public AuthContext(DbContextOptions<AuthContext> options) : base(options) { }

		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);
		}
	}
}