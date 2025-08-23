import { type User, type InsertUser, type Room, type InsertRoom, type File, type InsertFile, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Room methods
  getRoom(id: string): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  getRoomsByUser(userId: string): Promise<Room[]>;
  
  // File methods
  getFile(id: string): Promise<File | undefined>;
  getFilesByRoom(roomId: string): Promise<File[]>;
  createFile(file: InsertFile): Promise<File>;
  updateFile(id: string, content: string): Promise<File | undefined>;
  deleteFile(id: string): Promise<boolean>;
  
  // Chat methods
  getChatMessages(roomId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private rooms: Map<string, Room>;
  private files: Map<string, File>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.rooms = new Map();
    this.files = new Map();
    this.chatMessages = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Room methods
  async getRoom(id: string): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = randomUUID();
    const room: Room = { 
      ...insertRoom, 
      id, 
      createdAt: new Date() 
    };
    this.rooms.set(id, room);
    return room;
  }

  async getRoomsByUser(userId: string): Promise<Room[]> {
    return Array.from(this.rooms.values()).filter(
      (room) => room.createdBy === userId,
    );
  }

  // File methods
  async getFile(id: string): Promise<File | undefined> {
    return this.files.get(id);
  }

  async getFilesByRoom(roomId: string): Promise<File[]> {
    return Array.from(this.files.values()).filter(
      (file) => file.roomId === roomId,
    );
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = randomUUID();
    const now = new Date();
    const file: File = { 
      ...insertFile, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.files.set(id, file);
    return file;
  }

  async updateFile(id: string, content: string): Promise<File | undefined> {
    const file = this.files.get(id);
    if (file) {
      const updatedFile = { ...file, content, updatedAt: new Date() };
      this.files.set(id, updatedFile);
      return updatedFile;
    }
    return undefined;
  }

  async deleteFile(id: string): Promise<boolean> {
    return this.files.delete(id);
  }

  // Chat methods
  async getChatMessages(roomId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((message) => message.roomId === roomId)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      createdAt: new Date() 
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
