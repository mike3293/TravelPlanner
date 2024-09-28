using System.Security.Cryptography;
using System.Text;
using TravelPlannerApi.Domain.Repositories;
using TravelPlannerApi.Domain;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Options;
using TravelPlannerApi.Configuration;

namespace TravelPlannerApi.Services.Auth;

public class UserService
{
    private readonly IRepository<User> _userRepository;
    private readonly AuthSettings _authSettings;


    public UserService(IRepository<User> userRepository, IOptions<AuthSettings> authSettings)
    {
        _userRepository = userRepository;
        _authSettings = authSettings.Value;
    }


    public async Task RegisterUserAsync(string username, string password)
    {
        var existingUser = await _userRepository.GetWhereAsync(user => user.Username == username);
        if (existingUser.Any())
        {
            throw new Exception("User already exists");
        }

        var salt = GenerateSalt();
        var passwordHash = HashPassword(password, salt);
        var user = new User
        {
            Id = Guid.NewGuid().ToString("N"),
            Username = username,
            PasswordHash = passwordHash,
            Salt = salt,
        };

        await _userRepository.CreateAsync(user);
    }

    public async Task<AuthTokens?> AuthenticateUserAsync(string username, string password)
    {
        var users = await _userRepository.GetWhereAsync(user => user.Username == username);
        var user = users.FirstOrDefault();

        if (user == null || !VerifyPassword(password, user.PasswordHash, user.Salt))
        {
            return null;
        }

        var refreshToken = GenerateRefreshToken();
        user.RefreshTokens.Add(refreshToken);
        var refreshTokenSaved = await _userRepository.UpdateAsync(user.Id, user);
        if(!refreshTokenSaved)
        {
            throw new Exception("Failed to save token info");
        }

        var accessToken = GenerateAccessToken(user.Username);

        return new AuthTokens(accessToken, refreshToken);
    }

    public async Task<AuthTokens?> RefreshTokenAsync(string refreshToken)
    {
        var users = await _userRepository.GetWhereAsync(user => user.RefreshTokens.Contains(refreshToken));
        var user = users.FirstOrDefault();

        if (user == null)
        {
            return null;
        }

        user.RefreshTokens.Remove(refreshToken);

        var newRefreshToken = GenerateRefreshToken();
        user.RefreshTokens.Add(newRefreshToken);
        var refreshTokenSaved = await _userRepository.UpdateAsync(user.Id, user);
        if (!refreshTokenSaved)
        {
            throw new Exception("Failed to save token info");
        }

        var accessToken = GenerateAccessToken(user.Username);

        return new AuthTokens(accessToken, newRefreshToken);
    }


    private string GenerateAccessToken(string username)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_authSettings.SecretKey);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = _authSettings.ValidIssuer,
            Audience = _authSettings.ValidAudience,
            Subject = new ClaimsIdentity([new Claim(ClaimTypes.Name, username)]),
            Expires = DateTime.UtcNow.Add(_authSettings.AccessTokenExpiration),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        return Guid.NewGuid().ToString();
    }

    private string GenerateSalt()
    {
        var saltBytes = new byte[16];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(saltBytes);
        }

        return Convert.ToBase64String(saltBytes);
    }

    private string HashPassword(string password, string salt)
    {
        using var sha256 = SHA256.Create();

        var saltedPassword = password + salt;
        var bytes = Encoding.UTF8.GetBytes(saltedPassword);
        var hash = sha256.ComputeHash(bytes);

        return Convert.ToBase64String(hash);
    }

    private bool VerifyPassword(string password, string storedHash, string salt)
    {
        var hashedInputPassword = HashPassword(password, salt);

        return hashedInputPassword == storedHash;
    }
}
