using RealEstate.Data.Context;
using RealEstate.Data.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RealEstate.Data.UnitOfWorks
{
	public class UnitOfWork:IUnitOfWork
	{
		private readonly AppDbContext dbContext;

		public UnitOfWork(AppDbContext dbContext)
		{
			this.dbContext = dbContext;
		}
		public async ValueTask DisposeAsync()
		{
			await dbContext.DisposeAsync();
		}

		public int Save()
		{
			return dbContext.SaveChanges();
		}
		// IRepository<T> IUnitOfWork.GetRepository<T>() bu da olabilir 
		public IRepository<T> GetRepository<T>()
			where T : class, new()
		{
			return new Repository<T>(dbContext);
		}

		public async Task<int> SaveAsync()
		{
			return await dbContext.SaveChangesAsync();
		}


	}
}
