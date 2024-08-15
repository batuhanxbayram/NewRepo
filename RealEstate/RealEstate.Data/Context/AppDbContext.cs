using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RealEstate.Entity.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace RealEstate.Data.Context
{
	public class AppDbContext:IdentityDbContext<User,UserRole,Guid>
	{

		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
		{

		}

		public DbSet<Estate> Estates { get; set; }
		public DbSet<EstateType> EstatesTypes { get; set; }
		public DbSet<EstateStatus> EstatesStatuses { get; set; }
		public DbSet<EstateCurrency> EstatesCurrencies { get; set; }



		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);
			builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

		}


	}
}
