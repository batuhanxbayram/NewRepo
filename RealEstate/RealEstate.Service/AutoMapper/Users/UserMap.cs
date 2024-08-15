using AutoMapper;
using RealEstate.Entity.DTOs.User;
using RealEstate.Entity.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RealEstate.Service.AutoMapper.Users
{
	public class UserMap:Profile
	{

        public UserMap()
        {
            CreateMap<UserRegisterDTO,User>().ReverseMap();
        }
    }
}
