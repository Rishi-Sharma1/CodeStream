import { apiRequest } from '../lib/queryClient';

export const roomService = {
  _normalize(room) {
    if (!room) return room;
    // Ensure we always have an `id` field on client
    const id = room.id || room._id || room.roomId;
    return id ? { ...room, id } : room;
  },
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
    const data = await response.json();
    return this._normalize(data);
  },

  async getRoom(roomId) {
    const response = await apiRequest('GET', `/api/rooms/${roomId}`);
    const data = await response.json();
    return this._normalize(data);
  },
};
