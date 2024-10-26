using MongoDB.Driver;

namespace TravelPlannerApi.Domain.Repositories;

public class TripInfosRepository(MongoDbContext dbContext) : BaseRepository<Trip>(dbContext)
{
    protected override ProjectionDefinition<Trip> DefaultProjection => Builders<Trip>.Projection.Exclude(t => t.Days).Exclude(t => t.Accommodations);
}
