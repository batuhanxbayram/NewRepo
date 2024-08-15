using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RealEstate.Entity.DTOs.Estates
{
	public class EstateUpdateDTO
	{
		public Guid CurrencyId { get; set; }
		public Guid StatusId { get; set; }
		public Guid TypeId { get; set; }
		public DateTime EndDate { get; set; }
		public decimal Price { get; set; }

	}
}
