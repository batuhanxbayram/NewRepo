using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Data.Repository;
using RealEstate.Entity.Entities;

namespace RealEstate.WebApi.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class EstateStatusController : ControllerBase
	{

		private readonly IRepository<EstateStatus> _repository;


        public EstateStatusController(IRepository<EstateStatus> repository)
        {
			_repository = repository;
		}

        // POST: api/EstateStatus
        [HttpPost]
		public async Task<IActionResult> Post([FromBody] EstateStatus EstateStatus)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			
			await _repository.AddAsync(EstateStatus);
			await _repository.SaveAsync();
			return CreatedAtAction(nameof(Get), new { id = EstateStatus.Id }, EstateStatus);
		}

		// PUT: api/EstateStatus/{id}
		[HttpPut("{id}")]
		public async Task<IActionResult> Put(Guid id, [FromBody] EstateStatus EstateStatus)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			var existingEstateStatus = await _repository.GetByGuidAsync(id);
			if (existingEstateStatus == null)
				return NotFound();

			existingEstateStatus.Name = EstateStatus.Name;

			await _repository.UpdateAsync(existingEstateStatus);
			await _repository.SaveAsync();
			return NoContent();
		}

		// GET: api/EstateStatus/{id}
		[HttpGet("{id}")]
		public async Task<IActionResult> Get(Guid id)
		{
			var EstateStatus = await _repository.GetByGuidAsync(id);
			if (EstateStatus == null)
				return NotFound();

			return Ok(EstateStatus);
		}

		// DELETE: api/EstateStatus/{id}
		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(Guid id)
		{
			var EstateStatus = await _repository.GetByGuidAsync(id);
			if (EstateStatus == null)
				return NotFound();

			await _repository.DeleteAsync(EstateStatus);
			await _repository.SaveAsync();
			return NoContent();
		}

		// GET: api/EstateStatus/list
		[HttpGet("list")]
		public async Task<IActionResult> GetAll()
		{
			var EstateStatuses = await _repository.GetAllAsync();
			return Ok(EstateStatuses);
		}
	}
}


