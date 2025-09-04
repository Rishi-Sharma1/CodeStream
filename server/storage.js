import bcrypt from "bcryptjs";
import { User, Room, File, ChatMessage } from "../shared/models.js";

export class MongoStorage {
  // User methods
  async getUser(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async getUserByUsername(username) {
    try {
      return await User.findOne({ username });
    } catch (error) {
      console.error('Error getting user by username:', error);
      return null;
    }
  }

  async getUserByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  async createUser(insertUser) {
    try {
      const hashedPassword = await bcrypt.hash(insertUser.password, 10);
      const user = new User({
        ...insertUser,
        password: hashedPassword
      });
      return await user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async loginUser(credentials) {
    try {
      console.log("Login attempt with:", credentials);
      
      const user = await this.getUserByEmail(credentials.email);
      console.log("User found:", user);
      if (!user) return null;
      
      const isValid = await bcrypt.compare(credentials.password, user.password);
       console.log("Password valid:", isValid);
      if (!isValid) return null;
      
      return user;
    } catch (error) {
      console.error('Error logging in user:', error);
      return null;
    }
  }

  // Room methods
  async getRoom(id) {
    try {
      return await Room.findById(id);
    } catch (error) {
      console.error('Error getting room:', error);
      return null;
    }
  }

  async createRoom(insertRoom) {
    try {
      const room = new Room(insertRoom);
      return await room.save();
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  async getRoomsByUser(userId) {
    try {
      return await Room.find({ createdBy: userId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting rooms by user:', error);
      return [];
    }
  }

  // File methods
  async getFile(id) {
    try {
      return await File.findById(id);
    } catch (error) {
      console.error('Error getting file:', error);
      return null;
    }
  }

  async getFilesByRoom(roomId) {
    try {
      return await File.find({ roomId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting files by room:', error);
      return [];
    }
  }

  async createFile(insertFile) {
    try {
      const file = new File(insertFile);
      return await file.save();
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }

  async updateFile(id, content) {
    try {
      return await File.findByIdAndUpdate(
        id, 
        { content, updatedAt: new Date() },
        { new: true }
      );
    } catch (error) {
      console.error('Error updating file:', error);
      return null;
    }
  }

  async deleteFile(id) {
    try {
      return await File.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting file:', error);
      return null;
    }
  }

  // Chat methods
  async getChatMessages(roomId) {
    try {
      return await ChatMessage.find({ roomId }).sort({ createdAt: 1 });
    } catch (error) {
      console.error('Error getting chat messages:', error);
      return [];
    }
  }

  async createChatMessage(insertChatMessage) {
    try {
      const message = new ChatMessage(insertChatMessage);
      return await message.save();
    } catch (error) {
      console.error('Error creating chat message:', error);
      throw error;
    }
  }
}

// Create and export a single instance
export const storage = new MongoStorage();
