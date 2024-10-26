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
    public async Task<ActionResult<TripInfo>> Post([FromBody] TripUpdate model)
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
            // dates is DateOnly, create days accordingly
            Days = Enumerable.Range(0, (model.EndDate.DayNumber - model.StartDate.DayNumber) + 1)
                .Select(offset => new Domain.TripDay
                {
                    Id = Guid.NewGuid().ToString("N"),
                    Date = model.StartDate.AddDays(offset),
                    Activities = new List<Domain.TripDayActivity>(),
                })
                .ToList(),
            Accommodations = new List<Domain.TripDayActivity>(),
        };

        await _tripsRepository.CreateAsync(trip);
        var tripDataContract = TripsCreator.CreateFrom(trip);

        return tripDataContract;
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Trip>> Put(string id, [FromBody] TripUpdate model)
    {
        var userId = User.GetUserId();

        var trip = await _tripDetailsRepository.GetByIdAsync(id);
        if (trip == null || trip.UserId != userId)
        {
            return NotFound();
        }

        trip.Name = model.Name;
        trip.StartDate = model.StartDate;
        trip.EndDate = model.EndDate;
        UpdateDays();

        await _tripsRepository.UpdateAsync(trip.Id, trip);
        var tripDataContract = TripsCreator.CreateWithDetailsFrom(trip);

        return tripDataContract;

        void UpdateDays()
        {
            var newDays = Enumerable.Range(0, (model.EndDate.DayNumber - model.StartDate.DayNumber) + 1)
                .Select(offset => model.StartDate.AddDays(offset))
                .ToList();

            var unassignedActivities = new List<Domain.TripDayActivity>();

            var daysToRemove = trip.Days.Where(d => !newDays.Contains(d.Date)).ToList();
            foreach (var day in daysToRemove)
            {
                trip.Days.Remove(day);
                unassignedActivities.AddRange(day.Activities);
            }
            var daysToAdd = newDays.Where(d => trip.Days.All(day => day.Date != d)).Select(d => new Domain.TripDay
            {
                Id = Guid.NewGuid().ToString("N"),
                Date = d,
                Activities = new List<Domain.TripDayActivity>(),
            });

            trip.Days = trip.Days.Concat(daysToAdd).OrderBy(d => d.Date).ToList();

            var firstDay = trip.Days.First();
            firstDay.Activities = firstDay.Activities.Concat(unassignedActivities).ToList();
        }
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