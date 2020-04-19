namespace DailyTasks.Server.Infrastructure.Services.Auth
{
	using DailyTasks.Server.Infrastructure.Auth;
	using Microsoft.Extensions.Configuration;
	using Microsoft.IdentityModel.Tokens;
	using System;
	using System.IdentityModel.Tokens.Jwt;
	using System.Security.Claims;
	using System.Security.Principal;

	public class AuthService : IAuthService
	{
		private readonly IConfiguration _configuration;

		public AuthService(IConfiguration configuration)
		{
			_configuration = configuration;
		}

		public ClaimsIdentity GenerateClaimsIdentity(string id, string userName)
		{
			return new ClaimsIdentity(new GenericIdentity(userName, AuthConstants.IdentityType), new[]
			{
				new Claim(AuthConstants.JwtClaimId, id),
				new Claim(AuthConstants.JwtClaimRol, AuthConstants.JwtClaimApiAccess)
			});
		}

		public string GenerateEncodedToken(string userName, ClaimsIdentity identity, bool rememberMe)
		{
			var claims = new[]
			{
				new Claim(JwtRegisteredClaimNames.Sub, userName),
				new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
				new Claim(JwtRegisteredClaimNames.Iat, GetIssueDate()),
				identity.FindFirst(AuthConstants.JwtClaimRol),
				identity.FindFirst(AuthConstants.JwtClaimId)
			};

			var jwt = new JwtSecurityToken(
				issuer: AuthConfiguration.GetAuthIssuer(_configuration),
				audience: AuthConfiguration.GetAuthAudience(_configuration),
				claims: claims,
				notBefore: DateTime.UtcNow,
				expires: rememberMe ? DateTime.UtcNow.AddDays(7) : DateTime.UtcNow.AddHours(2),
				signingCredentials: new SigningCredentials(AuthConfiguration.GetSigningKey(_configuration), SecurityAlgorithms.HmacSha256));

			return new JwtSecurityTokenHandler().WriteToken(jwt);
		}

		private string GetIssueDate()
		{
			var result = Math.Round((DateTime.UtcNow.ToUniversalTime() - new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero)).TotalSeconds);

			return result.ToString();
		}
	}
}