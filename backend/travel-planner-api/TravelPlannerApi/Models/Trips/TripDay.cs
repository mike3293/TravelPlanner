namespace TravelPlannerApi.Models.Trips;

public class TripDay
{
    public required string Id { get; set; }

    public required DateTime Date { get; set; }

    public string? Name { get; set; }

    public required ICollection<TripDayActivity> Activities { get; set; }
}