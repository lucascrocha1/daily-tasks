namespace DailyTasks.Server
{
	using DailyTasks.Server.Infrastructure.Contexts;
	using DailyTasks.Server.Infrastructure.IdentityServer;
	using DailyTasks.Server.Infrastructure.Services.Email;
	using DailyTasks.Server.Infrastructure.Services.File;
	using DailyTasks.Server.Infrastructure.Services.User;
	using DailyTasks.Server.Models;
	using FluentValidation.AspNetCore;
	using MediatR;
	using Microsoft.AspNetCore.Builder;
	using Microsoft.AspNetCore.Hosting;
	using Microsoft.AspNetCore.Identity;
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

			services.AddDbContext<AuthContext>(opts =>
			{
				opts.UseSqlServer(_configuration.GetConnectionString("DailyTaskAuthConnection"));
			});

			services.Configure<IdentityOptions>(opts =>
			{
				opts.Password.RequireDigit = true;
				opts.Password.RequiredLength = 8;
				opts.Password.RequireLowercase = true;
				opts.Password.RequireUppercase = true;
				opts.Password.RequireNonAlphanumeric = true;
			});

			services.AddIdentity<ApplicationUser, IdentityRole>()
				.AddEntityFrameworkStores<AuthContext>()
				.AddDefaultTokenProviders();

			services.AddAuthentication();

			services.AddIdentityServer(opts =>
				{
					opts.UserInteraction.LoginUrl = _configuration["AuthRedirectUri"];
				})
				.AddDeveloperSigningCredential()
				.AddInMemoryIdentityResources(IdentityServerConfiguration.GetIdentityResources())
				.AddInMemoryApiResources(IdentityServerConfiguration.GetApiResources())
				.AddInMemoryClients(IdentityServerConfiguration.GetClients(_configuration))
				.AddAspNetIdentity<ApplicationUser>()
				.AddProfileService<ProfileService>();

			services.AddTransient<IUserService, UserService>();

			services.AddTransient<IFileService, FileService>();

			services.AddTransient<IEmailService, EmailService>();

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
				opts.RoutePrefix = "swagger";
				opts.SwaggerEndpoint("/swagger/v1/swagger.json", "DailyTasks.Server V1");
			});

			app.UseRouting();

			app.UseDefaultFiles();

			app.UseStaticFiles();

			app.UseAuthentication();

			app.UseAuthorization();

			app.UseIdentityServer();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});
		}
	}
}