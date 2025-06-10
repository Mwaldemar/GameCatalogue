using GameAPI.DTOs;
using GameAPI.Utilities;

namespace GameAPI.Services
{
    public interface ITagService
    {
        Task<IEnumerable<TagReadDto>> GetAllTagsAsync();
        Task<TagReadDto?> GetTagByIdAsync(int id);
        Task<Result<TagReadDto>> CreateTagAsync(TagCreateDto createDto);
        Task<Result> DeleteTagAsync(int id);
    }
}