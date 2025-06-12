import { apiService } from './apiService';
import type { ReviewReadDto, ReviewCreateDto, ReviewUpdateDto } from '../types/api';

export const reviewService = {

  getReviewsForGame: (gameId: number): Promise<ReviewReadDto[]> => {
    return apiService.get<ReviewReadDto[]>(`/api/games/${gameId}/reviews`);
  },

  createReviewForGame: (gameId: number, newReview: ReviewCreateDto): Promise<ReviewReadDto> => {
    return apiService.post<ReviewReadDto>(`/api/games/${gameId}/reviews`, newReview);
  },

  updateReview: (reviewId: number, reviewData: ReviewUpdateDto): Promise<ReviewReadDto> => {
    return apiService.patch<ReviewReadDto>(`/api/reviews/${reviewId}`, reviewData);
  },

  deleteReview: (reviewId: number): Promise<void> => {
    return apiService.delete(`/api/reviews/${reviewId}`);
  },

};