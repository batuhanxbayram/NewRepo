using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RealEstate.Core.Entities
{
	public class EntityBase:IEntityBase
	{
		public virtual Guid Id { get; set; } = Guid.NewGuid();
		public virtual bool IsDeleted { get; set; } = false;

	}
}
