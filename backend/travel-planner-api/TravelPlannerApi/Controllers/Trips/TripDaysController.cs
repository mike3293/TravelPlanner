using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlannerApi.Domain.Repositories;
using TravelPlannerApi.Models.Trips;
using TravelPlannerApi.Services.Auth;

namespace TravelPlannerApi.Controllers.Trips;

[Route("api/trips/{tripId}/days")]
[ApiController]
[Authorize]
public class TripDaysController : ControllerBase
{
    private readonly IRepository<Domain.Trip> _tripsRepository;


    public TripDaysController(IRepository<Domain.Trip> tripsRepository)
    {
        _tripsRepository = tripsRepository;
    }


    [HttpPut]
    public async Task<ActionResult<Trip>> Put(string tripId, IReadOnlyCollection<TripDay> days)
    {
        var userId = User.GetUserId();

        var trip = await _tripsRepository.GetByIdAsync(tripId);
        if (trip == null || trip.UserId != userId)
        {
            return NotFound();
        }

        trip.Days = days.Select(CreateFrom).ToList();
        await _tripsRepository.UpdateAsync(tripId, trip);

        var tripDataContract = TripsCreator.CreateWithDetailsFrom(trip);

        return tripDataContract;
    }

    private static Domain.TripDay CreateFrom(TripDay day)
    {
        return new Domain.TripDay
        {
            Id = day.Id,
            Date = day.Date,
            Activities = day.Activities.Select(CreateFrom).ToList(),
        };
    }

    private static Domain.TripDayActivity CreateFrom(TripDayActivity activity)
    {
        return new Domain.TripDayActivity
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