using RealEstate.Entity.DTOs.Estates;
using RealEstate.Entity.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RealEstate.Service.Services.EstateService
{
	public interface IEstateService
	{
		Task<int> GetTotalCount();
		Task<List<EstateStatusCountDTO>> GetEstateStatusCount();
		Task<EstateListDTO> GetAllByPagesAsync(
				int currentPage,
				int pageSize,
				bool isAscending = false,
				Guid? typeId = null,
				Guid? statusId = null);


		Task<IEnumerable<Estate>> GetEstatesByUserIdAsync(Guid userId);
	}
}
