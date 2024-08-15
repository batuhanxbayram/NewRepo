using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
	using RealEstate.Data.Repository;
	using RealEstate.Entity.Entities;

	namespace RealEstate.WebApi.Controllers
	{
		[Route("api/[controller]")]
		[ApiController]
		public class EstateCurrencyController : ControllerBase
		{

			private readonly IRepository<EstateCurrency> _repository;

			public EstateCurrencyController(IRepository<EstateCurrency> repository)
			{
				_repository = repository;
			}

		// POST: api/currency
		[Authorize]
		[HttpPost]
			
		public async Task<IActionResult> Post([FromBody] EstateCurrency currency)
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);


				await _repository.AddAsync(currency);
				await _repository.SaveAsync();


				return Ok();
			}

		// PUT: api/currency/{id}
		[Authorize]
		[HttpPut("{id}")]
			public async Task<IActionResult> Put(Guid id, [FromBody] EstateCurrency currency)
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var existingCurrency = await _repository.GetByGuidAsync(id);
				if (existingCurrency == null)
					return NotFound();

				existingCurrency.Name = currency.Name;
				existingCurrency.Symbol = currency.Symbol;

				await _repository.UpdateAsync(existingCurrency);
				await _repository.SaveAsync();
				return NoContent();
			}

			// GET: api/currency/{id}
			[HttpGet("{id}")]
			public async Task<IActionResult> Get(Guid id)
			{
				var currency = await _repository.GetByGuidAsync(id);
				if (currency == null)
					return NotFound();

				return Ok(currency);
			}

		// DELETE: api/currency/{id}
		[Authorize]
		[HttpDelete("{id}")]
			public async Task<IActionResult> Delete(Guid id)
			{
				var currency = await _repository.GetByGuidAsync(id);
				if (currency == null)
					return NotFound();

				await _repository.DeleteAsync(currency);
				await _repository.SaveAsync();
				return NoContent();
			}

			// GET: api/currency/list
			[HttpGet("list")]
			public async Task<IActionResult> GetAll()
			{
				var currencies = await _repository.GetAllAsync();
				return Ok(currencies);
			}
		}
	}

