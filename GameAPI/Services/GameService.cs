using AutoMapper;
using GameAPI.Data;
using GameAPI.DTOs;
using GameAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace GameAPI.Services
{
    public class GameService : IGameService
    {
        private readonly GameDbContext _context;
        private readonly IMapper _mapper;

        public GameService(GameDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<GameReadDto> CreateGameAsync(GameCreateDto createDto)
        {
            var game = _mapper.Map<Game>(createDto);

            if (createDto.TagIds.Any())
            {
                var tags = await _context.Tags
                    .Where(t => createDto.TagIds.Contains(t.Id))
                    .ToListAsync();

                foreach (var tag in tags)
                {
                    game.GameTags.Add(new GameTag { Tag = tag });
                }
            }

            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            return _mapper.Map<GameReadDto>(game);
        }

        public async Task<bool> DeleteGameAsync(int id)
        {
            var gameToDelete = await _context.Games.FindAsync(id);
            if (gameToDelete == null)
            {
                return false;
            }

            _context.Games.Remove(gameToDelete);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<GameReadDto>> GetAllGamesAsync()
        {
            var games = await _context.Games
                .Include(g => g.GameTags)
                    .ThenInclude(gt => gt.Tag)
                .AsNoTracking()
                .ToListAsync();

            return _mapper.Map<IEnumerable<GameReadDto>>(games);
        }

        public async Task<GameReadDto?> GetGameByIdAsync(int id)
        {
            var game = await _context.Games
                .Include(g => g.GameTags)
                    .ThenInclude(gt => gt.Tag)
                .AsNoTracking()
                .FirstOrDefaultAsync(g => g.Id == id);

            if (game == null)
            {
                return null;
            }

            return _mapper.Map<GameReadDto>(game);
        }

        public async Task<GameReadDto?> PatchGameAsync(int id, GameUpdateDto patchDto)
        {
            var game = await _context.Games
                .Include(g => g.GameTags)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (game == null)
            {
                return null;
            }

            if (patchDto.Title != null) game.Title = patchDto.Title;
            if (patchDto.ReleaseYear.HasValue) game.ReleaseYear = patchDto.ReleaseYear.Value;
            if (patchDto.Type != null) game.Type = patchDto.Type;
            if (patchDto.Studio != null) game.Studio = patchDto.Studio;
            if (patchDto.PriceOnLaunch.HasValue) game.PriceOnLaunch = patchDto.PriceOnLaunch.Value;
            if (patchDto.ImageUrl != null) game.ImageUrl = patchDto.ImageUrl;
            if (patchDto.Description != null) game.Description = patchDto.Description;

            if (patchDto.TagIds != null)
            {
                var tagsToRemove = game.GameTags
                    .Where(gt => !patchDto.TagIds.Contains(gt.TagId))
                    .ToList();

                foreach (var tagToRemove in tagsToRemove)
                {
                    _context.GameTags.Remove(tagToRemove);
                }

                var existingTagIds = game.GameTags.Select(gt => gt.TagId);
                var newTagIds = patchDto.TagIds.Except(existingTagIds);

                foreach (var tagId in newTagIds)
                {
                    game.GameTags.Add(new GameTag { TagId = tagId });
                }
            }

            await _context.SaveChangesAsync();

            var gameToReturn = await _context.Games
                .Include(g => g.GameTags)
                    .ThenInclude(gt => gt.Tag)
                .AsNoTracking()
                .FirstOrDefaultAsync(g => g.Id == id);

            return _mapper.Map<GameReadDto>(gameToReturn);
        }

        public async Task<bool> UpdateGameAsync(int id, GameUpdateDto updateDto)
        {
            var game = await _context.Games.FindAsync(id);
            if (game == null)
            {
                return false;
            }

            _mapper.Map(updateDto, game);

            await _context.SaveChangesAsync();
            return true;
        }
    }
}