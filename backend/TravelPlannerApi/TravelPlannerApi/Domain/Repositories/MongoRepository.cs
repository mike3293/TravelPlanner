using MongoDB.Bson;
using MongoDB.Driver;
using System.Linq.Expressions;

namespace TravelPlannerApi.Domain.Repositories;

public class MongoRepository<TEntity>(MongoDbContext dbContext) : IRepository<TEntity> where TEntity : class
{
    private readonly IMongoCollection<TEntity> _collection = dbContext.GetCollection<TEntity>();


    public async Task<ICollection<TEntity>> GetAllAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }

    public async Task<TEntity> GetByIdAsync(string id)
    {
        return await _collection.Find(Builders<TEntity>.Filter.Eq("Id", id)).FirstOrDefaultAsync();
    }

    public async Task<ICollection<TEntity>> GetWhereAsync(Expression<Func<TEntity, bool>> filter)
    {
        var mongoFilter = Builders<TEntity>.Filter.Where(filter);

        return await _collection.Find(mongoFilter).ToListAsync();
    }

    public async Task CreateAsync(TEntity entity)
    {
        await _collection.InsertOneAsync(entity);
    }

    public async Task<bool> UpdateAsync(string id, TEntity entity)
    {
        var result = await _collection.ReplaceOneAsync(Builders<TEntity>.Filter.Eq("Id", id), entity);

        return result.IsAcknowledged && result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _collection.DeleteOneAsync(Builders<TEntity>.Filter.Eq("Id", id));

        return result.IsAcknowledged && result.DeletedCount > 0;
    }
}
