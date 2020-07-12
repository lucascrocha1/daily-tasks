namespace DailyTask.Server
{
	using DailyTask.Server.Dominio;
	using DailyTask.Server.Infraestrutura.Contextos;
	using FluentValidation.AspNetCore;
	using Microsoft.AspNetCore.Builder;
	using Microsoft.AspNetCore.Hosting;
	using Microsoft.AspNetCore.Identity;
	using Microsoft.EntityFrameworkCore;
	using Microsoft.Extensions.Configuration;
	using Microsoft.Extensions.DependencyInjection;
	using Microsoft.Extensions.Hosting;

	public class Startup
	{
		private readonly IConfiguration _configuration;

		public Startup(IConfiguration configuration)
		{
			_configuration = configuration;
		}

		public void ConfigureServices(IServiceCollection services)
		{
			services.AddControllers()
				.AddNewtonsoftJson()
				.AddFluentValidation(opts =>
				{
					opts.RegisterValidatorsFromAssemblyContaining<Startup>();
				});

			services.AddDbContext<ServerContext>(opts =>
			{
				opts.UseSqlServer(_configuration.GetConnectionString("ServerConnection"));
			});

			services.AddIdentity<Usuario, IdentityRole>()
				.AddEntityFrameworkStores<ServerContext>()
				.AddDefaultTokenProviders();

			services.AddSwaggerGen();
		}

		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
				app.UseDeveloperExceptionPage();

			app.UseHttpsRedirection();

			app.UseSwagger();

			app.UseSwaggerUI(c =>
			{
				c.SwaggerEndpoint("/swagger/v1/swagger.json", "Daily Task");
				c.RoutePrefix = "";
			});

			app.UseRouting();

			app.UseAuthentication();

			app.UseAuthorization();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});
		}
	}
}