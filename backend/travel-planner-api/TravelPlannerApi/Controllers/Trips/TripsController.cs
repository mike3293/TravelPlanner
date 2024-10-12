using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    private readonly IRepository<Domain.Trip> _tripDetailsRepository;


    public TripsController(TripInfosRepository tripsRepository, IRepository<Domain.Trip> tripDetailsRepository)
    {
        _tripsRepository = tripsRepository;
        _tripDetailsRepository = tripDetailsRepository;
    }


    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<TripInfo>>> Get()
    {
        var userId = User.GetUserId();
        var trips = await _tripsRepository.GetWhereAsync(t => t.UserId == userId);
        var tripDataContracts = trips.Select(TripsCreator.CreateFrom).ToList();

        return tripDataContracts;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Trip>> Get(string id)
    {
        var userId = User.GetUserId();

        var trip = await _tripDetailsRepository.GetByIdAsync(id);
        if (trip == null || trip.UserId != userId)
        {
            return NotFound();
        }

        var tripDataContract = TripsCreator.CreateWithDetailsFrom(trip);

        return tripDataContract;
    }

    [HttpPost]
    public async Task<ActionResult<TripInfo>> Post([FromBody] CreateTripModel model)
    {
        var userId = User.GetUserId();

        var existingTrip = await _tripsRepository.GetWhereAsync(t => t.UserId == userId && t.Name == model.Name);
        if (existingTrip.Any())
        {
            return Conflict("A trip with the same name already exists");
        }

        var trip = new Domain.Trip
        {
            Id = Guid.NewGuid().ToString("N"),
            UserId = userId,
            Name = model.Name,
            StartDate = model.StartDate,
            EndDate = model.EndDate,
            Days = Enumerable.Range(0, (model.EndDate - model.StartDate).Days + 1)
                .Select(offset => new Domain.TripDay
                {
                    Id = Guid.NewGuid().ToString("N"),
                    Date = model.StartDate.AddDays(offset),
                    Name = $"Day {offset + 1}",
                    Activities = [],
                })
                .ToList(),
        };

        await _tripsRepository.CreateAsync(trip);
        var tripDataContract = TripsCreator.CreateFrom(trip);

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
}