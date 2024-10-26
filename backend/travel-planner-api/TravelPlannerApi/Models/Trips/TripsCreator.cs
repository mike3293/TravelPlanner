namespace TravelPlannerApi.Models.Trips;

public static class TripsCreator
{
    public static TripInfo CreateFrom(Domain.Trip trip)
    {
        return new TripInfo
        {
            Id = trip.Id,
            Name = trip.Name,
            StartDate = trip.StartDate,
            EndDate = trip.EndDate,
        };
    }

    public static Trip CreateWithDetailsFrom(Domain.Trip trip)
    {
        return new Trip
        {
            Id = trip.Id,
            Name = trip.Name,
            StartDate = trip.StartDate,
            EndDate = trip.EndDate,
            Days = trip.Days.Select(CreateFrom).ToList(),
            Accommodations = trip.Accommodations.Select(CreateFrom).ToList(),
        };
    }

    public static TripDay CreateFrom(Domain.TripDay day)
    {
        return new TripDay
        {
            Id = day.Id,
            Date = day.Date,
            Name = day.Name,
            Activities = day.Activities.Select(CreateFrom).ToList(),
        };
    }

    public static TripDayActivity CreateFrom(Domain.TripDayActivity activity)
    {
        return new TripDayActivity
        {
            Id = activity.Id,
            Address = activity.Address,
            Latitude = activity.Latitude,
            Longitude = activity.Longitude,
            Name = activity.Name,
            Description = activity.Description,
            ImageUrl = activity.ImageUrl,
            Duration = activity.Duration,
        };
    }
}