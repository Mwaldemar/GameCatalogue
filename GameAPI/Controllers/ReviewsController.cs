using System.Security.Claims;
using GameAPI.DTOs;
using GameAPI.Services;
using GameAPI.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GameAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReviewById(int id)
        {
            var reviewDto = await _reviewService.GetReviewByIdAsync(id);
            return reviewDto == null ? NotFound() : Ok(reviewDto);
        }

        [Authorize]
        [HttpPost("games/{gameId}")]
        public async Task<IActionResult> CreateReview(int gameId, [FromBody] ReviewCreateDto reviewDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var result = await _reviewService.CreateReviewAsync(gameId, reviewDto, userId);

            return result.ToActionResult(
                onSuccess: (dto, isCreation) => CreatedAtAction(nameof(GetReviewById), new { id = dto.Id }, dto),
                onFailure: error => StatusCode((int)error.Type, error.Message)
            );
        }

        [Authorize]
        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] ReviewUpdateDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var result = await _reviewService.UpdateReviewAsync(id, dto, userId);

            return result.ToActionResult(
                onSuccess: (updatedDto, _) => Ok(updatedDto),
                onFailure: error => StatusCode((int)error.Type, error.Message)
            );
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var isAdmin = User.IsInRole("Admin");

            var result = await _reviewService.DeleteReviewAsync(id, userId, isAdmin);

            return result.ToActionResult(
                onSuccess: () => NoContent(),
                onFailure: error => StatusCode((int)error.Type, error.Message)
            );
        }
    }
}