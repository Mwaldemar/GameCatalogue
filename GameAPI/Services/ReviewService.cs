using AutoMapper;
using GameAPI.Data;
using GameAPI.DTOs;
using GameAPI.Models;
using GameAPI.Utilities;
using Microsoft.EntityFrameworkCore;

namespace GameAPI.Services
{
    public class ReviewService : IReviewService
    {
        private readonly GameDbContext _context;
        private readonly IMapper _mapper;

        public ReviewService(GameDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<ReviewReadDto>> CreateReviewAsync(int gameId, ReviewCreateDto createDto, int userId)
        {
            var gameExists = await _context.Games.AnyAsync(g => g.Id == gameId);
            if (!gameExists)
            {
                return Result<ReviewReadDto>.Failure(ResultError.NotFound($"Game with ID {gameId} not found."));
            }

            var review = _mapper.Map<Review>(createDto);
            review.GameId = gameId;
            review.UserId = userId;
            review.CreatedAt = DateTime.UtcNow;

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            var createdReview = await _context.Reviews
                .Include(r => r.User)
                .FirstAsync(r => r.Id == review.Id);

            var reviewDto = _mapper.Map<ReviewReadDto>(createdReview);
            return Result<ReviewReadDto>.Success(reviewDto, isCreation: true);
        }

        public async Task<Result> DeleteReviewAsync(int reviewId, int userId, bool isUserAdmin)
        {
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null)
            {
                return Result.Failure(ResultError.NotFound($"Review with ID {reviewId} not found."));
            }

            if (review.UserId != userId && !isUserAdmin)
            {
                return Result.Failure(ResultError.Forbidden("User is not authorized to delete this review."));
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return Result.Success();
        }

        public async Task<ReviewReadDto?> GetReviewByIdAsync(int id)
        {
            var review = await _context.Reviews
                .Include(r => r.User)
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == id);

            return review == null ? null : _mapper.Map<ReviewReadDto>(review);
        }

        public async Task<Result<ReviewReadDto>> UpdateReviewAsync(int reviewId, ReviewUpdateDto updateDto, int userId)
        {
            var review = await _context.Reviews.Include(r => r.User).FirstOrDefaultAsync(r => r.Id == reviewId);
            if (review == null)
            {
                return Result<ReviewReadDto>.Failure(ResultError.NotFound($"Review with ID {reviewId} not found."));
            }

            if (review.UserId != userId)
            {
                return Result<ReviewReadDto>.Failure(ResultError.Forbidden("User is not authorized to update this review."));
            }

            _mapper.Map(updateDto, review);

            await _context.SaveChangesAsync();

            var updatedDto = _mapper.Map<ReviewReadDto>(review);
            return Result<ReviewReadDto>.Success(updatedDto);
        }
    }
}