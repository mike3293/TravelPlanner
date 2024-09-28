using System.Linq.Expressions;

namespace TravelPlannerApi.Domain.Repositories;

public interface IRepository<TEntity> where TEntity : class
{
    Task<ICollection<TEntity>> GetAllAsync();

    Task<TEntity> GetByIdAsync(string id);

    Task<ICollection<TEntity>> GetWhereAsync(Expression<Func<TEntity, bool>> filter);

    Task CreateAsync(TEntity entity);

    Task<bool> UpdateAsync(string id, TEntity entity);

    Task<bool> DeleteAsync(string id);
}
