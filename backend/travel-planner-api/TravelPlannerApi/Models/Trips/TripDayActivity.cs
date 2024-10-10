namespace TravelPlannerApi.Models.Trips;

public class TripDayActivity
{
    public required string Id { get; set; }

    public required string Address { get; set; }

    public required double Latitude { get; set; }

    public required double Longitude { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    public TimeSpan? Duration { get; set; }
}