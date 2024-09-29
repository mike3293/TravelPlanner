using Microsoft.AspNetCore.Mvc;
using TravelPlannerApi.Models.Auth;
using TravelPlannerApi.Services.Auth;

namespace TravelPlannerApi.Controllers.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private const string RefreshTokenCookie = "RefreshToken";

    private readonly UserService _userService;


    public AuthController(UserService userService)
    {
        _userService = userService;
    }


    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        try
        {
            await _userService.RegisterUserAsync(model.Username, model.Password);

            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<string>> Login([FromBody] LoginModel model)
    {
        try
        {
            var tokens = await _userService.AuthenticateUserAsync(model.Username, model.Password);
            if (tokens is null)
            {
                return Unauthorized();
            }

            AddRefreshTokenCookie(tokens);

            return tokens.AccessToken;
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<string>> Refresh()
    {
        try
        {
            var refreshToken = Request.Cookies[RefreshTokenCookie];
            if (string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized();
            }

            var tokens = await _userService.RefreshTokenAsync(refreshToken);
            if (tokens is null)
            {
                return Unauthorized();
            }

            AddRefreshTokenCookie(tokens);

            return tokens.AccessToken;
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }


    private void AddRefreshTokenCookie(AuthTokens tokens)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            Expires = tokens.RefreshToken.ExpirationDate,
        };

        Response.Cookies.Append(RefreshTokenCookie, tokens.RefreshToken.Token, cookieOptions);
    }
}