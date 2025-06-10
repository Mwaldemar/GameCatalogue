using GameAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GameAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GamesController : ControllerBase
    {
        private readonly IGameService _gameService;

        public GamesController(IGameService gameService)
        {
            _gameService = gameService;
        }

        [HttpGet]
        public async Task<IActionResult> GetGames()
        {
            var gamesDto = await _gameService.GetAllGamesAsync();
            return Ok(gamesDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetGameById(int id)
        {
            var gameDto = await _gameService.GetGameByIdAsync(id);
            return gameDto == null ? NotFound($"Game with ID {id} not found.") : Ok(gameDto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateGame([FromBody] GameCreateDto dto)
        {
            var newGame = await _gameService.CreateGameAsync(dto);
            return CreatedAtAction(nameof(GetGameById), new { id = newGame.Id }, newGame);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGame(int id, [FromBody] GameUpdateDto dto)
        {
            var success = await _gameService.UpdateGameAsync(id, dto);
            return success ? NoContent() : NotFound($"Game with ID {id} not found.");
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchGame(int id, [FromBody] GameUpdateDto dto)
        {
            var updatedGame = await _gameService.PatchGameAsync(id, dto);
            return updatedGame == null ? NotFound($"Game with ID {id} not found.") : Ok(updatedGame);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGame(int id)
        {
            var success = await _gameService.DeleteGameAsync(id);
            return success ? NoContent() : NotFound($"Game with ID {id} not found.");
        }
    }
}