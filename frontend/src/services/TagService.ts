import { apiService } from './apiService';
import type { TagReadDto, TagCreateDto } from '../types/api';

export const tagService = {
  
  getAllTags: (): Promise<TagReadDto[]> => {
    return apiService.get<TagReadDto[]>('/api/tags');
  },

  createTag: (newTag: TagCreateDto): Promise<TagReadDto> => {
    return apiService.post<TagReadDto>('/api/tags', newTag);
  },

  deleteTag: (id: number): Promise<void> => {
    return apiService.delete(`/api/tags/${id}`);
  },
};