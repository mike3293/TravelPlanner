namespace TravelPlannerApi.Models.Trips;

public class TripUpdate
{
    public required string Name { get; set; }

    public DateOnly StartDate { get; set; } 

    public DateOnly EndDate { get; set; }
}