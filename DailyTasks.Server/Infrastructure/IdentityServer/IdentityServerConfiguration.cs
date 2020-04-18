namespace DailyTasks.Server.Infrastructure.IdentityServer
{
	using IdentityServer4;
	using IdentityServer4.Models;
    using Microsoft.Extensions.Configuration;
    using System.Collections.Generic;

    public static class IdentityServerConfiguration
    {
        public static List<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile()
            };
        }

        public static List<ApiResource> GetApiResources()
        {
            return new List<ApiResource>
            {
                new ApiResource("daily-task-login", "Daily Task - Login")
            };
        }

        public static List<Client> GetClients(IConfiguration _configuration)
        {
            return new List<Client>
            {
                new Client
                {
                    RequireConsent = false,
                    AllowOfflineAccess = true,
                    AlwaysSendClientClaims = true,
                    ClientId = "daily-task-client",
                    ClientName = "Daily Task Client",
                    AllowAccessTokensViaBrowser = true,
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AlwaysIncludeUserClaimsInIdToken = true,
                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "daily-task-login"
                    },
                    RedirectUris = { _configuration["AuthRedirectUri"] },
                    AllowedCorsOrigins = { _configuration["AuthRedirectUri"] },
                    PostLogoutRedirectUris = { _configuration["AuthRedirectUri"] },
                }
            };
        }
    }
}