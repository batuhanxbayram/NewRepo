using RealEstate.Entity.Entities;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace RealEstate.Service.Services.TokenService.Abstract
{
	public interface ITokenService
	{
		Task<JwtSecurityToken> CreateToken(User user, IList<string> roles);
		string GenerateRefleshToken();
		ClaimsPrincipal? GetClaimsPrincipalFromExpiredToken(string token);
	}
}
