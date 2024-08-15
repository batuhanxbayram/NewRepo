using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RealEstate.Data.Context;
using RealEstate.Data.Repository;
using RealEstate.Data.UnitOfWorks;
using RealEstate.Entity.Entities;


namespace RealEstate.Data.Extensions
{
	public static class DataLayerExtensions
	{
		public static IServiceCollection LoadDataLayerExtension(this IServiceCollection services, IConfiguration config)
		{
			services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
			services.AddDbContextPool<AppDbContext>(opt => opt.UseSqlServer(config.GetConnectionString("DefaultConnection")));
			services.AddScoped<IUnitOfWork, UnitOfWork>();
			services.AddIdentityCore<User>(
				opt =>
				{
					opt.Password.RequiredLength = 6;
					opt.Password.RequireNonAlphanumeric = false;
					opt.Password.RequireDigit = false;
					opt.Password.RequireLowercase = false;
					opt.Password.RequireUppercase = false;
					opt.SignIn.RequireConfirmedEmail = false;
				}
				).AddRoles<UserRole>()
				.AddEntityFrameworkStores<AppDbContext>();
				
			
			return services;
		}
	}
}
