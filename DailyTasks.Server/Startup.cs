namespace DailyTasks.Server
{
	using DailyTasks.Server.Infrastructure;
	using DailyTasks.Server.Infrastructure.Services.File;
	using DailyTasks.Server.Infrastructure.Services.User;
	using FluentValidation.AspNetCore;
	using MediatR;
	using Microsoft.AspNetCore.Builder;
	using Microsoft.AspNetCore.Hosting;
	using Microsoft.EntityFrameworkCore;
	using Microsoft.Extensions.Configuration;
	using Microsoft.Extensions.DependencyInjection;
	using Microsoft.Extensions.Hosting;
	using Microsoft.OpenApi.Models;

	public class Startup
	{
		private readonly IConfiguration _configuration;

		public Startup(IConfiguration configuration)
		{
			_configuration = configuration;
		}

		public void ConfigureServices(IServiceCollection services)
		{
			services
				.AddControllers()
				.AddFluentValidation(opts =>
				{
					opts.RegisterValidatorsFromAssemblyContaining(typeof(Startup));
				})
				.AddNewtonsoftJson();

			services.AddMediatR(typeof(Startup));

			services.AddDbContext<DailyTaskContext>(opts =>
			{
				opts.UseSqlServer(_configuration.GetConnectionString("DailyTaskConnection"));
			});

			services.AddTransient<IUserService, UserService>();

			services.AddTransient<IFileService, FileService>();

			services.AddSwaggerGen(opts =>
			{
				opts.CustomSchemaIds(e => e.FullName);

				opts.SwaggerDoc("v1", new OpenApiInfo
				{
					Title = "DailyTasks.Server",
					Version = "v1"
				});
			});

			services.AddCors(opts => opts.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));
		}

		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
				app.UseDeveloperExceptionPage();

			app.UseCors();

			app.UseSwagger();

			app.UseSwaggerUI(opts =>
			{
				opts.RoutePrefix = string.Empty;
				opts.SwaggerEndpoint("/swagger/v1/swagger.json", "DailyTasks.Server V1");
			});

			app.UseRouting();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});
		}
	}
}