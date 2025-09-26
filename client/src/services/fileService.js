import { apiRequest } from '../lib/queryClient';

export const fileService = {
  async getFiles(roomId) {
    const response = await apiRequest('GET', `/api/files/room/${roomId}`);
    return response.json();
  },

  async createFile(fileData) {
    const response = await apiRequest('POST', '/api/files', fileData);
    return response.json();
  },

  async updateFile(fileId, content) {
    const response = await apiRequest('PUT', `/api/files/${fileId}`, { content });
    return response.json();
  },

  async deleteFile(fileId) {
    const response = await apiRequest('DELETE', `/api/files/${fileId}`);
    return response.json();
  },
};
