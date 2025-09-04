import mongoose from 'mongoose';
import { z } from 'zod';

// MongoDB Schemas using Mongoose
export const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const sessionSchema = new mongoose.Schema({
  sid: { 
    type: String, 
    required: true, 
    unique: true 
  },
  sess: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  },
  expire: { 
    type: Date, 
    required: true 
  }
});

export const roomSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  createdBy: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const fileSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    default: "" 
  },
  language: { 
    type: String, 
    default: "javascript" 
  },
  roomId: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const chatMessageSchema = new mongoose.Schema({
  roomId: { 
    type: String, 
    required: true 
  },
  userId: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Zod validation schemas
export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

export const insertRoomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  createdBy: z.string().min(1, "Creator ID is required")
});

export const insertFileSchema = z.object({
  name: z.string().min(1, "File name is required"),
  content: z.string().optional(),
  language: z.string().optional(),
  roomId: z.string().min(1, "Room ID is required")
});

export const insertChatMessageSchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  userId: z.string().min(1, "User ID is required"),
  message: z.string().min(1, "Message is required")
});
