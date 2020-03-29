namespace DailyTasks.Server
{
	using DailyTasks.Server.Infrastructure.Services.Mongo.Connection;
	using DailyTasks.Server.Infrastructure.Services.Mongo.Helper;
	using MediatR;
	using Microsoft.AspNetCore.Builder;
	using Microsoft.AspNetCore.Hosting;
	using Microsoft.Extensions.DependencyInjection;
	using Microsoft.Extensions.Hosting;
	using Microsoft.OpenApi.Models;

	public class Startup
	{
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddControllers().AddNewtonsoftJson();

			services.AddMediatR(typeof(Startup));

			services.AddTransient<IMongoConnection, MongoConnection>();

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