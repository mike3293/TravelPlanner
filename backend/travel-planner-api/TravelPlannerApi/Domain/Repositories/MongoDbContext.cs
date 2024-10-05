using MongoDB.Driver;

namespace TravelPlannerApi.Domain.Repositories;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;


    public MongoDbContext(IConfiguration configuration)
    {
        var client = new MongoClient(configuration.GetConnectionString("MongoDb"));
        _database = client.GetDatabase("TravelPlanner");
    }


    public IMongoCollection<TEntity> GetCollection<TEntity>()
    {
        return _database.GetCollection<TEntity>(typeof(TEntity).Name);
    }
}