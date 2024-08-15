using RealEstate.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RealEstate.Entity.Entities
{
	public class Estate:EntityBase
	{
		public Guid TypeId { get; set; }
		public EstateType Type { get; set; }
		public Guid StatusId { get; set; }

		public EstateStatus Status { get; set; }

		public DateTime StartDate { get; set; }
		public DateTime EndDate { get; set; }
		
		public List<string> Photos { get; set; } = new List<string>();
		public decimal Price { get; set; }
		public Guid CurrencyId { get; set; }
		public EstateCurrency Currency { get; set; }
		public string CreatedBy { get; set; }
		public double? GeoX { get; set; }
		public double? GeoY { get; set; }
		public Guid UserId { get; set; }
		public User User { get; set; }
		//public User CreatedByUser { get; set; }
	}
}
