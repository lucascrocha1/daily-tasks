namespace DailyTasks.Server.Infrastructure.Auth
{
	using Microsoft.AspNetCore.Authentication.JwtBearer;
	using Microsoft.Extensions.Configuration;
	using Microsoft.Extensions.DependencyInjection;
	using Microsoft.IdentityModel.Tokens;
	using System;
	using System.Text;

	public static class AuthConfiguration
	{
		public static IServiceCollection AddAuth(this IServiceCollection services, IConfiguration _configuration)
		{
			var authIssuer = GetAuthIssuer(_configuration);
			var authAudience = GetAuthAudience(_configuration);
			var signingKey = GetSigningKey(_configuration);

			services.AddAuthentication(opts =>
			{
				opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			})
			.AddJwtBearer(opts =>
			{
				opts.SaveToken = true;
				opts.ClaimsIssuer = authIssuer;
				opts.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateIssuer = true,
					ValidIssuer = authIssuer,

					ValidateAudience = true,
					ValidAudience = authAudience,

					ValidateIssuerSigningKey = true,
					IssuerSigningKey = signingKey,

					ValidateLifetime = true,
					ClockSkew = TimeSpan.Zero,
					RequireExpirationTime = false
				};
			});

			return services;
		}

		public static SymmetricSecurityKey GetSigningKey(IConfiguration _configuration)
		{
			var authSecret = _configuration["Auth:Secret"];

			return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(authSecret));
		}

		public static string GetAuthIssuer(IConfiguration _configuration)
		{
			return _configuration["Auth:Issuer"];
		}

		public static string GetAuthAudience(IConfiguration _configuration)
		{
			return _configuration["Auth:Audience"];
		}
	}
}