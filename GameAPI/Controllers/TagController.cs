using GameAPI.DTOs;
using GameAPI.Services;
using GameAPI.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GameAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagsController : ControllerBase
    {
        private readonly ITagService _tagService;

        public TagsController(ITagService tagService)
        {
            _tagService = tagService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagReadDto>>> GetTags()
        {
            var tags = await _tagService.GetAllTagsAsync();
            return Ok(tags);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TagReadDto>> GetTag(int id)
        {
            var tag = await _tagService.GetTagByIdAsync(id);
            return tag == null ? NotFound() : Ok(tag);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateTag(TagCreateDto dto)
        {
            var result = await _tagService.CreateTagAsync(dto);

            return result.ToActionResult(
                onSuccess: (createdDto, _) => CreatedAtAction(nameof(GetTag), new { id = createdDto!.Id }, createdDto),
                onFailure: error => StatusCode((int)error!.Type, error!.Message)
            );
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(int id)
        {
            var result = await _tagService.DeleteTagAsync(id);
            return result.ToActionResult(
                onSuccess: () => NoContent(),
                onFailure: error => StatusCode((int)error.Type, error.Message)
            );
        }
    }
}