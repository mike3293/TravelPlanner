namespace TravelPlannerApi.Domain;

public class User
{
    public required string Id { get; set; }

    public required string Username { get; set; }

    public required string PasswordHash { get; set; }

    public required string Salt { get; set; }

    public List<RefreshToken> RefreshTokens { get; set; } = [];
}
