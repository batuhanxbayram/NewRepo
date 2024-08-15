using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using RealEstate.Data.Context;
using RealEstate.Data.Repository;
using RealEstate.Entity.DTOs.Estates;
using RealEstate.Entity.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RealEstate.Service.Services.EstateService
{
	public class EstateService : IEstateService
	{
		private readonly IRepository<Estate> repository;
		private readonly AppDbContext context;

		public EstateService(IRepository<Estate> repository,AppDbContext context)
        {
			this.repository = repository;
			this.context = context;
		}

        public async Task<int> GetTotalCount()
		{
			return await repository.CountAsync();
		}

		public async Task<List<EstateStatusCountDTO>> GetEstateStatusCount()
		{
			var statusCounts = await context.Estates
				.GroupBy(e => e.Status.Name)
				.Select(group => new EstateStatusCountDTO
				{
					statusName = group.Key,
					count = group.Count()
				})
				.ToListAsync();

			return statusCounts;
		}

		public async Task<EstateListDTO> GetAllByPagesAsync(
			int currentPage ,
			int pageSize ,
			bool isAscending = false,
			Guid ? typeId = null,
			Guid? statusId = null)
		{
			pageSize = pageSize > 20 ? 20 : pageSize;

			

			var estates = await repository.GetAllAsync(
				x => (!typeId.HasValue || x.TypeId == typeId) &&
					 (!statusId.HasValue || x.StatusId == statusId) &&
					 !x.IsDeleted,
				x => x.Type,
				x => x.Status
				);

			var sortedEstates = isAscending
				? estates.OrderBy(x => x.StartDate).Skip((currentPage - 1) * pageSize).Take(pageSize).ToList()
				: estates.OrderByDescending(x => x.StartDate).Skip((currentPage - 1) * pageSize).Take(pageSize).ToList();

			return new EstateListDTO
			{
				Estates = sortedEstates,
				TypeId = typeId,
				StatusId = statusId,
				TotalCount = estates.Count(),
				CurrentPage = currentPage,
				PageSize = pageSize,
				IsAscending = isAscending
			};
		}

		public async Task<IEnumerable<Estate>> GetEstatesByUserIdAsync(Guid userId)
		{
			return await context.Estates
		   .Where(e => e.UserId == userId)
		   .Include(e => e.Type) 
		   .Include(e => e.Status)
		   .Include(e => e.Currency)
		   .ToListAsync();
		}
	}
}
