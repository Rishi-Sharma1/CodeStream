import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertRoomSchema, insertFileSchema, insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Room routes
  app.post("/api/rooms", async (req, res) => {
    try {
      const roomData = insertRoomSchema.parse(req.body);
      const room = await storage.createRoom(roomData);
      res.json(room);
    } catch (error) {
      res.status(400).json({ message: "Invalid room data" });
    }
  });

  app.get("/api/rooms/:id", async (req, res) => {
    try {
      const room = await storage.getRoom(req.params.id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch room" });
    }
  });

  // File routes
  app.get("/api/rooms/:roomId/files", async (req, res) => {
    try {
      const files = await storage.getFilesByRoom(req.params.roomId);
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  app.post("/api/files", async (req, res) => {
    try {
      const fileData = insertFileSchema.parse(req.body);
      const file = await storage.createFile(fileData);
      res.json(file);
    } catch (error) {
      res.status(400).json({ message: "Invalid file data" });
    }
  });

  app.put("/api/files/:id", async (req, res) => {
    try {
      const { content } = req.body;
      const file = await storage.updateFile(req.params.id, content);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json(file);
    } catch (error) {
      res.status(500).json({ message: "Failed to update file" });
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFile(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json({ message: "File deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Chat routes
  app.get("/api/rooms/:roomId/messages", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.params.roomId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time collaboration
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        // Broadcast to all connected clients except sender
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        });
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  return httpServer;
}
