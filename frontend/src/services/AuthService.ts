import { apiService } from './apiService';
import type { LoginDto, AuthResponseDto } from '../types/api';

export const authService = {
  
  login: (loginData: LoginDto): Promise<AuthResponseDto> => {
    return apiService.post<AuthResponseDto>('/api/auth/login', loginData);
  },

};