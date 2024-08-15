using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Data.Repository;
using RealEstate.Entity.Entities;

namespace RealEstate.WebApi.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class EstateTypeController : ControllerBase
	{
		private readonly IRepository<EstateType> _repository;

        public EstateTypeController(IRepository<EstateType> repository)
        {
			_repository = repository;
		}

        // POST: api/EstateStatus
        [HttpPost]
		public async Task<IActionResult> Post([FromBody] EstateType estateType)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			
			await _repository.AddAsync(estateType);
			await _repository.SaveAsync();
			return Ok();
		}

		// PUT: api/EstateStatus/{id}
		[HttpPut("{id}")]
		public async Task<IActionResult> Put(Guid id, [FromBody] EstateType estateType)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			var existingEstateType = await _repository.GetByGuidAsync(id);
			if (existingEstateType == null)
				return NotFound();

			existingEstateType.Name = estateType.Name;

			await _repository.UpdateAsync(existingEstateType);
			await _repository.SaveAsync();
			return NoContent();
		}

		// GET: api/EstateType/{id}
		[HttpGet("{id}")]
		public async Task<IActionResult> Get(Guid id)
		{
			var EstateType = await _repository.GetByGuidAsync(id);
			if (EstateType == null)
				return NotFound();

			return Ok(EstateType);
		}

		// DELETE: api/EstateType/{id}
		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(Guid id)
		{
			var EstateType = await _repository.GetByGuidAsync(id);
			if (EstateType == null)
				return NotFound();

			await _repository.DeleteAsync(EstateType);
			await _repository.SaveAsync();
			return NoContent();
		}

		// GET: api/EstateType/list
		[HttpGet("list")]
		public async Task<IActionResult> GetAll()
		{
			var EstateType = await _repository.GetAllAsync();
			return Ok(EstateType);
		}

	}
}
