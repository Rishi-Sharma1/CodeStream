import mongoose from 'mongoose';
import { userSchema, sessionSchema, roomSchema, fileSchema, chatMessageSchema } from './schema.js';

// Create models from schemas
export const User = mongoose.model('User', userSchema);
export const Session = mongoose.model('Session', sessionSchema);
export const Room = mongoose.model('Room', roomSchema);
export const File = mongoose.model('File', fileSchema);
export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

// Export all models
export const models = {
  User,
  Session,
  Room,
  File,
  ChatMessage
};
