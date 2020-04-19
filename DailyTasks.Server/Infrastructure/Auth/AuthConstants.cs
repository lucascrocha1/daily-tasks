namespace DailyTasks.Server.Infrastructure.Auth
{
    public static class AuthConstants
    {
        public const string JwtClaimId = "id";
        public const string JwtClaimRol = "rol";
        public const string JwtClaimApiAccess = "api_access";
        public const string IdentityType = "Token";
        public const string AuthorizationPolicy = "ApiUser";
    }
}