import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import session from "express-session";
import MongoStore from "connect-mongo";
import { storage } from "./storage.js";
import dotenv from "dotenv";
import { insertRoomSchema, insertFileSchema, insertChatMessageSchema, insertUserSchema, loginSchema } from "../shared/schema.js";
import { log } from "console";


dotenv.config({ path: "./server/.env" });
console.log("LOADED MONGODB_URI:", process.env.MONGODB_URI);

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key',
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60
  }),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
});

const requireAuth = (req, res, next) =>
  req.session?.userId ? next() : res.status(401).json({ message: "Authentication required" });

function handle(res, promise, successStatus = 200) {
  promise
    .then(data => res.status(successStatus).json(data))
    .catch(err => res.status(400).json({ message: err.message || "Invalid data" }));
}

export async function registerRoutes(app) {
  app.use(sessionMiddleware);

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      if (await storage.getUserByEmail(userData.email))
        throw new Error("User already exists with this email");
      const user = await storage.createUser(userData);
      req.session.userId = user.id;
      req.session.user = { id: user.id, username: user.username, email: user.email };
      res.json({ user: req.session.user });
      // Redirect handled in client, not here
    } catch (error) {
      res.status(400).json({ message: error.message || "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    console.log("Login attempt");
    
    try {
      console.log("Hello Line 1");
      const credentials = loginSchema.parse(req.body);
      console.log("Hello Line 2");
      const user = await storage.loginUser(credentials);
      console.log("Hello Line 3");
      if (!user) throw new Error("Invalid email or password");
      console.log("Hello Line 4");
      req.session.userId = user.id;
      console.log("Hello Line 5");
      req.session.user = { id: user.id, username: user.username, email: user.email };
      console.log("Hello Line 6");
      res.json({ user: req.session.user });
      console.log("Hello Line 7");
    } catch (error) {
      res.status(400).json({ message: error.message || "Invalid login data" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(err =>
      res.status(err ? 500 : 200).json({ message: err ? "Error logging out" : "Logged out successfully" })
    );
  });

  app.get("/api/auth/me", requireAuth, (req, res) => res.json({ user: req.session.user }));

  // Room routes
  app.post("/api/rooms", requireAuth, (req, res) => {
    handle(res, (async () => {
      const roomData = insertRoomSchema.parse(req.body);
      return await storage.createRoom({ ...roomData, createdBy: req.session.userId });
    })());
  });

  app.get("/api/rooms", requireAuth, (req, res) => handle(res, storage.getRoomsByUser(req.session.userId)));
  app.get("/api/rooms/:id", requireAuth, (req, res) => handle(res, storage.getRoom(req.params.id)));

  // File routes
  app.post("/api/files", requireAuth, (req, res) => {
    handle(res, (async () => {
      const fileData = insertFileSchema.parse(req.body);
      return await storage.createFile({ ...fileData, roomId: fileData.roomId });
    })());
  });

  app.get("/api/files/room/:roomId", requireAuth, (req, res) => handle(res, storage.getFilesByRoom(req.params.roomId)));
  app.put("/api/files/:id", requireAuth, (req, res) => {
    if (typeof req.body.content !== 'string')
      return res.status(400).json({ message: "Content must be a string" });
    handle(res, storage.updateFile(req.params.id, req.body.content));
  });
  app.delete("/api/files/:id", requireAuth, (req, res) => {
    handle(res, (async () => {
      const deleted = await storage.deleteFile(req.params.id);
      if (!deleted) throw new Error("File not found");
      return { message: "File deleted successfully" };
    })());
  });

  // Chat routes
  app.post("/api/chat", requireAuth, (req, res) => {
    handle(res, (async () => {
      const messageData = insertChatMessageSchema.parse(req.body);
      return await storage.createChatMessage({ ...messageData, userId: req.session.userId });
    })());
  });
  app.get("/api/chat/:roomId", requireAuth, (req, res) => handle(res, storage.getChatMessages(req.params.roomId)));

  // WebSocket server
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        wss.clients.forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN)
            client.send(JSON.stringify(data));
        });
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
  });

  return server;
}
