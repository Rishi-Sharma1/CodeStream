import { apiRequest } from '../lib/queryClient';

export const roomService = {
  generateRoom(userId) {
    const id = Math.random().toString(36).substring(2, 9);
    return {
      id,
      name: `Room ${id}`,
      createdBy: userId || 'anonymous',
      createdAt: new Date(),
    };
  },

  async createRoom(roomData) {
    const response = await apiRequest('POST', '/api/rooms', roomData);
    return response.json();
  },

  async getRoom(roomId) {
    const response = await apiRequest('GET', `/api/rooms/${roomId}`);
    return response.json();
  },
};
