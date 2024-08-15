using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RealEstate.Entity.Entities;
using RealEstate.Service.Services.TokenService.Abstract;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace RealEstate.Service.Services.TokenService.Concreate
{
	public class TokenService:ITokenService
	{
		private readonly UserManager<User> userManager;
		private readonly TokenSettings settings;

        

        public TokenService(IOptions<TokenSettings> options,UserManager<User> userManager)
        {
            settings= options.Value;
			this.userManager = userManager;
        }


        public async Task<JwtSecurityToken> CreateToken(User user, IList<string> roles)
		{
			var claims = new List<Claim>()
			{
				new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
				new Claim(JwtRegisteredClaimNames.Email,user.Email),
				new Claim(ClaimTypes.NameIdentifier,user.Id.ToString())
			};

			foreach (var role in roles)
			{
				claims.Add(new Claim(ClaimTypes.Role, role));
			}

			var securitykey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Secret));

			var token = new JwtSecurityToken(
				issuer: settings.Issuer,
				audience: settings.Audience,
				claims: claims,
				expires: DateTime.Now.AddMinutes(settings.TokenValidityMinutes),
				signingCredentials: new SigningCredentials(securitykey, SecurityAlgorithms.HmacSha256)
				);

			await userManager.AddClaimsAsync(user, claims);

			return token;

		}

		public string GenerateRefleshToken()
		{
			var randomNumber = new byte[64];
			using var generator = RandomNumberGenerator.Create();
			generator.GetBytes(randomNumber);

			return Convert.ToBase64String(randomNumber);
		}

		public ClaimsPrincipal? GetClaimsPrincipalFromExpiredToken(string token)
		{
			TokenValidationParameters tokenValidationParamaters = new()
			{
				ValidateIssuer = false,
				ValidateAudience = false,
				ValidateIssuerSigningKey = true,
				IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Secret)),
				ValidateLifetime = false
			};

			JwtSecurityTokenHandler tokenHandler = new();
			var principal = tokenHandler.ValidateToken(token, tokenValidationParamaters, out SecurityToken securityToken);
			if (securityToken is not JwtSecurityToken jwtSecurityToken
				|| !jwtSecurityToken.Header.Alg
				.Equals(SecurityAlgorithms.HmacSha256,
				StringComparison.InvariantCultureIgnoreCase))
				throw new SecurityTokenException("Token bulunamadı.");

			return principal;
		}
	}
}
