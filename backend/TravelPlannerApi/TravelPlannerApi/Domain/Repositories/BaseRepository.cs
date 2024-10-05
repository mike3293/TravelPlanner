using MongoDB.Driver;
using System.Linq.Expressions;

namespace TravelPlannerApi.Domain.Repositories;

public class BaseRepository<TEntity>(MongoDbContext dbContext) : IRepository<TEntity> where TEntity : class
{
    protected readonly IMongoCollection<TEntity> Collection = dbContext.GetCollection<TEntity>();

    protected virtual ProjectionDefinition<TEntity> DefaultProjection => Builders<TEntity>.Projection.Combine();


    public async Task<ICollection<TEntity>> GetAllAsync()
    {
        return await Collection
            .Find(_ => true)
            .Project<TEntity>(DefaultProjection)
            .ToListAsync();
    }

    public async Task<TEntity?> GetByIdAsync(string id)
    {
        return await Collection
            .Find(Builders<TEntity>.Filter.Eq("Id", id))
            .Project<TEntity>(DefaultProjection)
            .FirstOrDefaultAsync();
    }

    public async Task<ICollection<TEntity>> GetWhereAsync(Expression<Func<TEntity, bool>> filter)
    {
        var mongoFilter = Builders<TEntity>.Filter.Where(filter);

        return await Collection
            .Find(mongoFilter)
            .Project<TEntity>(DefaultProjection)
            .ToListAsync();
    }

    public async Task CreateAsync(TEntity entity)
    {
        await Collection.InsertOneAsync(entity);
    }

    public async Task<bool> UpdateAsync(string id, TEntity entity)
    {
        var result = await Collection.ReplaceOneAsync(Builders<TEntity>.Filter.Eq("Id", id), entity);

        return result.IsAcknowledged && result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await Collection.DeleteOneAsync(Builders<TEntity>.Filter.Eq("Id", id));

        return result.IsAcknowledged && result.DeletedCount > 0;
    }
}
