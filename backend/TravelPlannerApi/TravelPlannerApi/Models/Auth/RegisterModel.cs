using System.ComponentModel.DataAnnotations;

namespace TravelPlannerApi.Models.Auth;

public class RegisterModel
{
    [EmailAddress]
    public required string Email { get; set; }

    public required string Password { get; set; }
}
