using AutoMapper;
using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Data.Repository;
using RealEstate.Data.UnitOfWorks;
using RealEstate.Entity.DTOs.User;
using RealEstate.Entity.Entities;
using RealEstate.Service.Services.TokenService.Abstract;
using RealEstate.Service.Services.TokenService.Concreate;
using System.Data;
using System.IdentityModel.Tokens.Jwt;

namespace RealEstate.WebApi.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly IConfiguration config;
		private readonly ITokenService tokenService;
		private readonly UserManager<User> userManager;
		private readonly RoleManager<UserRole> roleManager;
		private readonly IMapper mapper;
		private readonly IRepository<User> repository;

		public AuthController(IConfiguration config, ITokenService tokenService, UserManager<User> userManager, RoleManager<UserRole> roleManager, IMapper mapper, IUnitOfWork unitOfWork, IHttpContextAccessor httpContext,IRepository<User> repository)
		{
			this.config = config;
			this.tokenService = tokenService;
			this.userManager = userManager;
			this.roleManager = roleManager;
			this.mapper = mapper;
			this.repository = repository;
		}


		[HttpPost("Register")]
		public async Task<IActionResult> Register(UserRegisterDTO request, CancellationToken cancellationToken)
		{

			var user = mapper.Map<User>(request);
			user.UserName = request.Email;
			user.SecurityStamp = Guid.NewGuid().ToString();

			var result = await userManager.CreateAsync(user, request.Password);
			if (result.Succeeded)
			{
				if (!await roleManager.RoleExistsAsync("user"))
				{
					await roleManager.CreateAsync(
						new UserRole()
						{
							Id = Guid.NewGuid(),
							ConcurrencyStamp = Guid.NewGuid().ToString(),
							NormalizedName = "USER",
							Name = "user"
						}
						);
				}

				var response = await userManager.AddToRoleAsync(user, "user");

			}

			return Ok();
		}
		 




		[HttpPost("Login")]
		public async Task<UserLoginResponseDTO> Login(UserLoginDTO request, CancellationToken cancellationToken)
		{

			var user = await userManager.FindByEmailAsync(request.Email);
			bool checkPassword = await userManager.CheckPasswordAsync(user, request.Password);

			var roles = await userManager.GetRolesAsync(user);

			JwtSecurityToken token = await tokenService.CreateToken(user, roles);

			string refleshToken = tokenService.GenerateRefleshToken();

			_ = int.TryParse(config["JWT:RefleshTokenValidityDays"], out int refleshTokenValidityDays);

			user.RefreshToken = refleshToken;
			user.RefreshTokenExpireTime = DateTime.Now.AddDays(refleshTokenValidityDays);

			await userManager.UpdateAsync(user);
			await userManager.UpdateSecurityStampAsync(user);

			string _token = new JwtSecurityTokenHandler().WriteToken(token);

			await userManager.SetAuthenticationTokenAsync(user, "Default", "AccessToken", _token);

			return new UserLoginResponseDTO()
			{
				Token = _token,
				RefreshToken = refleshToken,
				Expiration = token.ValidTo,
				Role = roles.FirstOrDefault()
			};


		}
		[HttpPost("Logout")]
		public async Task<IActionResult> Logout(string email)
		{
			User? user = await userManager.FindByEmailAsync(email);

			user.RefreshToken = null;
			await userManager.UpdateAsync(user);
			

			return Ok();

		}

		[HttpGet("count")]
		public async Task<IActionResult> CountUser()
		{

			var count = await repository.CountAsync();

			return Ok(count);
		}

		[HttpGet("getUserId")]
		public async Task<IActionResult> GetUserId()
		{
			
			var user = await userManager.GetUserAsync(User);


			if (user == null)
			{
				return Unauthorized("Kullanıcı bulunamadı.");
			}

			return Ok(new { UserId = user.Id });
		}





	}
}
