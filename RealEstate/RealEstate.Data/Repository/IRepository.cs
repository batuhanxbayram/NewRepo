using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace RealEstate.Data.Repository
{
	public interface IRepository<T> where T : class, new()
	{
		Task AddAsync(T entity);
		Task<List<T>> GetAllAsync(Expression<Func<T, bool>> predicate = null, params Expression<Func<T, object>>[] includeProperties);
		Task<T> GetAsync(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includeProperties);
		Task<T> GetByGuidAsync(Guid id);
		Task<T> UpdateAsync(T entity);
		Task<bool> DeleteAsync(T entity);
		Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);
		Task<int> CountAsync(Expression<Func<T, bool>> predicate = null);
		Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);
		Task SaveAsync();
		Task<decimal> GetAverageAsync(Expression<Func<T, decimal>> selector, Expression<Func<T, bool>> predicate = null);
	}
}
