using AutoMapper;
using GameAPI.Data;
using GameAPI.DTOs;
using GameAPI.Models;
using GameAPI.Utilities;
using Microsoft.EntityFrameworkCore;

namespace GameAPI.Services
{
    public class TagService : ITagService
    {
        private readonly GameDbContext _context;
        private readonly IMapper _mapper;

        public TagService(GameDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TagReadDto>> GetAllTagsAsync()
        {
            var tags = await _context.Tags.AsNoTracking().ToListAsync();
            return _mapper.Map<IEnumerable<TagReadDto>>(tags);
        }

        public async Task<TagReadDto?> GetTagByIdAsync(int id)
        {
            var tag = await _context.Tags.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id);
            return tag == null ? null : _mapper.Map<TagReadDto>(tag);
        }

        public async Task<Result<TagReadDto>> CreateTagAsync(TagCreateDto createDto)
        {
            var existingTag = await _context.Tags.FirstOrDefaultAsync(t => t.Name.ToLower() == createDto.Name.ToLower());
            if (existingTag != null)
            {
                return Result<TagReadDto>.Failure(ResultError.Conflict($"A tag with the name '{createDto.Name}' already exists."));
            }

            var tag = _mapper.Map<Tag>(createDto);
            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();

            var tagDto = _mapper.Map<TagReadDto>(tag);
            return Result<TagReadDto>.Success(tagDto, isCreation: true);
        }

        public async Task<Result> DeleteTagAsync(int id)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null)
            {
                return Result.Failure(ResultError.NotFound($"Tag with ID {id} not found."));
            }

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();

            return Result.Success();
        }
    }
}