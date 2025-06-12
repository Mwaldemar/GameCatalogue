// src/services/GameService.ts

import { apiService } from './apiService';
import type { GameReadDto, GameUpdateDto, GameCreateDto } from '../types/api'; // Assuming you have this type defined

export const gameService = {
  
  getAllGames: (): Promise<GameReadDto[]> => {
    return apiService.get<GameReadDto[]>('/api/games');
  },

  deleteGame: (id: number): Promise<void> => {
    return apiService.delete(`/api/games/${id}`);
  },

  createGame: (newGame: GameCreateDto): Promise<GameCreateDto> => {
    return apiService.post<GameCreateDto>('/api/games', newGame);
  },

  getGameById: (id: number): Promise<GameReadDto> => {
    return apiService.get<GameReadDto>(`/api/games/${id}`);
  },

  patchGame: (id: number, gameData: GameUpdateDto): Promise<GameReadDto> => {
    return apiService.patch<GameReadDto>(`/api/games/${id}`, gameData);
  }
};