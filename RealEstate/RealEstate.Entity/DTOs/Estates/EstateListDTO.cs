using RealEstate.Entity.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RealEstate.Entity.DTOs.Estates
{
	public class EstateListDTO
	{
		public List<Estate> Estates { get; set; }
		public Guid? TypeId { get; set; }
		public Guid? StatusId { get; set; }
		public int TotalCount { get; set; }
		public int CurrentPage { get; set; }
		public int PageSize { get; set; }
		public bool IsAscending { get; set; }
	}
}
