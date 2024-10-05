namespace TravelPlannerApi.Domain;

public class Trip
{
    public required string Id { get; set; }

    public required string UserId { get; set; }

    public required string Name { get; set; }

    public DateTime StartDate { get; set; } 

    public DateTime EndDate { get; set; }

    public ICollection<TripDay> Days { get; set; } = [];
}