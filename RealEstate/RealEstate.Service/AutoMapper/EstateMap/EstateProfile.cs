using AutoMapper;
using RealEstate.Entity.DTOs.Estates;
using RealEstate.Entity.Entities;


namespace RealEstate.Service.AutoMapper.EstateMap
{
	public class EstateProfile : Profile
	{


		public EstateProfile()
		{
			CreateMap<Estate,EstateAddDTO>().ReverseMap();
			
		}



	}
}
