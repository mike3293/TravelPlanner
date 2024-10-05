namespace TravelPlannerApi.Models.Trips;

public class TripInfo
{
    public required string Id { get; set; }

    public required string Name { get; set; }

    public DateTime StartDate { get; set; } 

    public DateTime EndDate { get; set; }
}