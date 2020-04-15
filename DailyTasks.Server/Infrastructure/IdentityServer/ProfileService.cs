namespace DailyTasks.Server.Infrastructure.IdentityServer
{
    using DailyTasks.Server.Models;
    using IdentityServer4.Models;
    using IdentityServer4.Services;
    using Microsoft.AspNetCore.Identity;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;

    public class ProfileService : IProfileService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ProfileService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var user = await GetUser(context.Subject);

            var claims = await _userManager.GetClaimsAsync(user);

            var allClaims = claims.Concat(context.IssuedClaims).ToList();

            allClaims.Add(new Claim(Constants.Auth.ClaimEmail, user.Email));
            allClaims.Add(new Claim(Constants.Auth.ClaimPicture, user.Picture));
            allClaims.Add(new Claim(Constants.Auth.ClaimName, user.DisplayName));

            context.IssuedClaims.AddRange(allClaims.GroupBy(e => e.Type).Select(e => e.First()));
        }

        public Task IsActiveAsync(IsActiveContext context)
        {
            context.IsActive = true;

            return Task.CompletedTask;
        }

        private async Task<ApplicationUser> GetUser(ClaimsPrincipal subject)
        {
            return await _userManager.GetUserAsync(subject);
        }
    }
}