using System.Security.Claims;

namespace TravelPlannerApi.Services.Auth;

public static class ClaimsPrincipalExtensions
{
    public static string GetUserId(this ClaimsPrincipal user)
    {
        if (user == null)
            throw new ArgumentNullException(nameof(user));

        return user.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";
    }
}