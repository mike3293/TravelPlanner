namespace TravelPlannerApi.Configuration;

public class AuthSettings
{
    public required string ValidIssuer { get; init; }

    public required string ValidAudience { get; init; }

    public required string SecretKey { get; init; }

    public required TimeSpan AccessTokenExpiration { get; init; }

    public required TimeSpan RefreshTokenExpiration { get; init; }
}