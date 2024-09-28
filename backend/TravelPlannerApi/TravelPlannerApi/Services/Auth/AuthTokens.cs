namespace TravelPlannerApi.Services.Auth;

public record AuthTokens(
    string AccessToken,
    string RefreshToken);
