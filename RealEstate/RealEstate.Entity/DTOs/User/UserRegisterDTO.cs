﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RealEstate.Entity.DTOs.User
{
	public class UserRegisterDTO
	{
		public string FullName { get; set; }
		public string Email { get; set; }
		public string Password { get; set; }
		public string ConfirmPassword { get; set; }
	}
}
