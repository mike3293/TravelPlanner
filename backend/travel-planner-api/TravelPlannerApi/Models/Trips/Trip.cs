using TravelPlannerApi.Domain;

namespace TravelPlannerApi.Models.Trips;

public class Trip : TripInfo 
{
    public required IReadOnlyCollection<TripDay> Days { get; set; }
}