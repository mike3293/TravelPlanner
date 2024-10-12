namespace TravelPlannerApi.Domain;

public class Trip
{
    public required string Id { get; set; }

    public required string UserId { get; set; }

    public required string Name { get; set; }

    public required DateTime StartDate { get; set; } 

    public required DateTime EndDate { get; set; }

    public required ICollection<TripDay> Days { get; set; }
}