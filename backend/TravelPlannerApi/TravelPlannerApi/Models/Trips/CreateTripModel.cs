namespace TravelPlannerApi.Models.Trips;

public class CreateTripModel
{
    public required string Name { get; set; }

    public DateTime StartDate { get; set; } 

    public DateTime EndDate { get; set; }
}