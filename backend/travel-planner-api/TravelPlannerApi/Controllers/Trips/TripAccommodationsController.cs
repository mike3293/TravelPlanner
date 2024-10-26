using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlannerApi.Domain.Repositories;
using TravelPlannerApi.Models.Trips;
using TravelPlannerApi.Services.Auth;

namespace TravelPlannerApi.Controllers.Trips;

[Route("api/trips/{tripId}/accommodations")]
[ApiController]
[Authorize]
public class TripAccommodationsController : ControllerBase
{
    private readonly IRepository<Domain.Trip> _tripsRepository;


    public TripAccommodationsController(IRepository<Domain.Trip> tripsRepository)
    {
        _tripsRepository = tripsRepository;
    }


    [HttpPut]
    public async Task<ActionResult<Trip>> Put(string tripId, IReadOnlyCollection<TripDayActivity> accommodations)
    {
        var userId = User.GetUserId();

        var trip = await _tripsRepository.GetByIdAsync(tripId);
        if (trip == null || trip.UserId != userId)
        {
            return NotFound();
        }

        trip.Accommodations = accommodations.Select(CreateFrom).ToList();
        await _tripsRepository.UpdateAsync(tripId, trip);

        var tripDataContract = TripsCreator.CreateWithDetailsFrom(trip);

        return tripDataContract;
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