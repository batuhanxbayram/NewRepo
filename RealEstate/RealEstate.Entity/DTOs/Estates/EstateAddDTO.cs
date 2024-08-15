using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RealEstate.Entity.DTOs.Estates
{
	public class EstateAddDTO
	{
		public Guid EstateCurrencyId { get; set; }
		public Guid EstateStatusId { get; set; }
		public Guid EstateTypeId { get; set; }
		public DateTime StartDate { get; set; }
		public DateTime EndDate { get; set; }
		public decimal Price { get; set; }
		public int CreatedBy { get; set; }
		public double GeoX { get; set; }
		public double GeoY { get; set; }
		public Guid UserId { get; set; }
		public List<string> Photos { get; set; } = new List<string>();
	}
}
