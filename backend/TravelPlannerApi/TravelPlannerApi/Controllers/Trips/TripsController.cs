using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlannerApi.Domain;
using TravelPlannerApi.Domain.Repositories;
using TravelPlannerApi.Models.Trips;
using TravelPlannerApi.Services.Auth;

namespace TravelPlannerApi.Controllers.Trips;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TripsController : ControllerBase
{
    private readonly TripInfosRepository _tripsRepository;


    public TripsController(TripInfosRepository tripsRepository)
    {
        _tripsRepository = tripsRepository;
    }


    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<TripInfo>>> Get()
    {
        var userId = User.GetUserId();
        var trips = await _tripsRepository.GetWhereAsync(t => t.UserId == userId);
        var tripDataContracts = trips.Select(CreateFrom).ToList();

        return tripDataContracts;
    }

    [HttpPost]
    public async Task<ActionResult<TripInfo>> Post([FromBody] CreateTripModel model)
    {
        var userId = User.GetUserId();

        var existingTrip = await _tripsRepository.GetWhereAsync(t => t.UserId == userId && t.Name == model.Name);
        if (existingTrip.Any())
        {
            return Conflict("A trip with the same name already exists.");
        }

        var trip = new Trip
        {
            Id = Guid.NewGuid().ToString("N"),
            UserId = userId,
            Name = model.Name,
            StartDate = model.StartDate,
            EndDate = model.EndDate,
        };

        await _tripsRepository.CreateAsync(trip);
        var tripDataContract = CreateFrom(trip);

        return tripDataContract;
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        var userId = User.GetUserId();
        var trip = await _tripsRepository.GetByIdAsync(id);
        if (trip == null || trip.UserId != userId)
        {
            return NotFound();
        }

        await _tripsRepository.DeleteAsync(trip.Id);

        return Ok();
    }


    private TripInfo CreateFrom(Trip trip)
    {
        return new TripInfo
        {
            Id = trip.Id,
            Name = trip.Name,
            StartDate = trip.StartDate,
            EndDate = trip.EndDate,
        };
    }
}