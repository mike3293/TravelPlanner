using TravelPlannerApi.Domain;

namespace TravelPlannerApi.Services.Auth;

public record AuthTokens(
    string AccessToken,
    RefreshToken RefreshToken);
