namespace TravelPlannerApi.Models.Trips;

public class Trip : TripInfo 
{
    public required IReadOnlyCollection<TripDay> Days { get; set; }

    public required IReadOnlyCollection<TripDayActivity> Accommodations { get; set; }
}