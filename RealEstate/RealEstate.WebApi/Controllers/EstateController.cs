using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using RealEstate.Data.Repository;
using RealEstate.Entity.DTOs.Estates;
using RealEstate.Entity.Entities;
using RealEstate.Service.Services.EstateService;

namespace RealEstate.WebApi.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class EstateController : ControllerBase
	{
		private readonly IRepository<Estate> _repository;
		private readonly IMapper mapper;
		private readonly IEstateService estateService;
		private readonly UserManager<User> userManager;

		public EstateController(IRepository<Estate> repository,IMapper mapper,IEstateService estateService,UserManager<User> userManager)
		{
			_repository = repository;
			this.mapper = mapper;
			this.estateService = estateService;
			this.userManager = userManager;
		}

		// GET: api/estate/{id}
		[HttpGet("{id}")]
		public async Task<IActionResult> Get(Guid id)
		{
			var estate = await _repository.GetByGuidAsync(id);
			if (estate == null)
				return NotFound();

			return Ok(estate);
		}

		[HttpGet("count")]
		public async Task<IActionResult> Count()
		{

			var count = await estateService.GetTotalCount();

			return Ok(count);
		}

		[HttpGet("averagePrice")]
		public async Task<ActionResult<decimal>> GetAveragePrice()
		{
			var averagePrice = await _repository.GetAverageAsync(e => e.Price);
			return Ok(averagePrice);
		}


		[HttpGet("counts")]
		public async Task<IActionResult> GetEstateStatusCounts()
		{
			var count = await estateService.GetEstateStatusCount();

			return Ok(count);
		}

		[HttpGet("pages")]
		public async Task<IActionResult> GetAllByPages(Guid? typeId = null,
				Guid? statusId = null,
				int currentPage = 1,
				int pageSize = 6,
				bool isAscending = false)
		{

			var data = await estateService.GetAllByPagesAsync(currentPage,pageSize,isAscending,typeId,statusId);

			return Ok(data);
		}

		[HttpPost("upload")]
		public async Task<IActionResult> UploadPhoto([FromForm] IFormFile photo)
		{
			if (photo == null || photo.Length == 0)
				return BadRequest("Fotoğraf yüklenemedi.");

			var folderName = "estate_photos";
			var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folderName);

			if (!Directory.Exists(pathToSave))
				Directory.CreateDirectory(pathToSave);

			var fileName = Guid.NewGuid().ToString() + Path.GetExtension(photo.FileName);
			var fullPath = Path.Combine(pathToSave, fileName);
			var dbPath = Path.Combine(folderName, fileName);

			using (var stream = new FileStream(fullPath, FileMode.Create))
			{
				await photo.CopyToAsync(stream);
			}

			return Ok(new { dbPath });
		}

		//[HttpPost("upload")]
		//public async Task<IActionResult> UploadPhotos([FromForm] List<IFormFile> photos)
		//{
		//	if (photos == null || photos.Count == 0)
		//		return BadRequest("Fotoğraflar yüklenemedi.");

		//	var folderName = "estate_photos";
		//	var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folderName);

		//	if (!Directory.Exists(pathToSave))
		//		Directory.CreateDirectory(pathToSave);

		//	var dbPaths = new List<string>();

		//	foreach (var photo in photos)
		//	{
		//		var fileName = Guid.NewGuid().ToString() + Path.GetExtension(photo.FileName);
		//		var fullPath = Path.Combine(pathToSave, fileName);
		//		var dbPath = Path.Combine(folderName, fileName);

		//		using (var stream = new FileStream(fullPath, FileMode.Create))
		//		{
		//			await photo.CopyToAsync(stream);
		//		}

		//		dbPaths.Add(dbPath);
		//	}

		//	return Ok(new { dbPaths });
		//}





		// GET: api/estate/list
		[HttpGet("list")]
		
		public async Task<IActionResult> GetAll()
		{
			var estates = await _repository.GetAllAsync(x => !x.IsDeleted);
			return Ok(estates);
		}

		// POST: api/estate
		[HttpPost]
		[Authorize]
		public async Task<IActionResult> Post(EstateAddDTO estate)
		{
			var user = await userManager.GetUserAsync(User);



			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			var map = mapper.Map<Estate>(estate);
			map.CurrencyId=estate.EstateCurrencyId;
			map.StatusId=estate.EstateStatusId;
			map.TypeId=estate.EstateTypeId;
			

			foreach(var item in estate.Photos)
			{
				map.Photos.Add(item);
			}
			map.GeoX=estate.GeoX;
			map.GeoY=estate.GeoY;
			map.UserId=user.Id;


			await _repository.AddAsync(map);
			await _repository.SaveAsync();
			return Ok();
		}

		// PUT: api/estate/{id}
		[HttpPut("{id}")]
		[Authorize]
		public async Task<IActionResult> Put(Guid id, [FromBody] EstateUpdateDTO estate)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			var existingEstate = await _repository.GetByGuidAsync(id);
			if (existingEstate == null)
				return NotFound();

			
			existingEstate.TypeId = estate.TypeId;
			existingEstate.StatusId = estate.StatusId;
			existingEstate.EndDate = estate.EndDate;	
			existingEstate.Price = estate.Price;
			existingEstate.CurrencyId = estate.CurrencyId;



			await _repository.UpdateAsync(existingEstate);
			await _repository.SaveAsync();
			return NoContent();
		}

		// DELETE: api/estate/{id}
		[HttpDelete("{id}")]
		[Authorize]
		public async Task<IActionResult> Delete(Guid id)
		{
			var estate = await _repository.GetByGuidAsync(id);
			if (estate == null)
				return NotFound();

			estate.IsDeleted = true;
			await _repository.DeleteAsync(estate);
			await _repository.SaveAsync();
			
			return NoContent();
		}

		[HttpGet("myEstate")]
		public async Task<IActionResult> GetMyEstates()
		{
			var user = await userManager.GetUserAsync(User);

			var userId = user.Id;

			var estates = await estateService.GetEstatesByUserIdAsync(userId);
			return Ok(estates);
		}

	}


}

