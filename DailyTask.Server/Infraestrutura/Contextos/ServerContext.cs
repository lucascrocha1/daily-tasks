namespace DailyTask.Server.Infraestrutura.Contextos
{
	using DailyTask.Server.Dominio;
	using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
	using Microsoft.EntityFrameworkCore;

	public class ServerContext : IdentityDbContext<Usuario>
	{
		public ServerContext(DbContextOptions<ServerContext> options) : base(options)
		{

		}

		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);
		}
	}
}