using GameAPI.DTOs;

public interface IGameService
{
    Task<IEnumerable<GameReadDto>> GetAllGamesAsync();
    Task<GameReadDto?> GetGameByIdAsync(int id);
    Task<GameReadDto> CreateGameAsync(GameCreateDto createDto);
    Task<bool> UpdateGameAsync(int id, GameUpdateDto updateDto);
    Task<GameReadDto?> PatchGameAsync(int id, GameUpdateDto patchDto);
    Task<bool> DeleteGameAsync(int id);
}