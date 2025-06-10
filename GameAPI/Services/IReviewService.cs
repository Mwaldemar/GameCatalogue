using GameAPI.DTOs;
using GameAPI.Utilities;

namespace GameAPI.Services
{
    public interface IReviewService
    {
        Task<Result<ReviewReadDto>> CreateReviewAsync(int gameId, ReviewCreateDto createDto, int userId);
        Task<ReviewReadDto?> GetReviewByIdAsync(int id);

        Task<Result<ReviewReadDto>> UpdateReviewAsync(int reviewId, ReviewUpdateDto updateDto, int userId);
        Task<Result> DeleteReviewAsync(int reviewId, int userId, bool isUserAdmin);
    }
}