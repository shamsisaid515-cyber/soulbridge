import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
admin.initializeApp({
  projectId: firebaseConfig.projectId,
});

const db = admin.firestore();
// Use the specific database ID if available
const firestore = firebaseConfig.firestoreDatabaseId 
  ? db.terminate().then(() => admin.firestore(firebaseConfig.firestoreDatabaseId))
  : db;
// Standard admin.firestore() is usually enough if it's the default, 
// but AI Studio uses custom database IDs.
const dbInstance = admin.firestore(firebaseConfig.firestoreDatabaseId);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Track online users
  const onlineUsers = new Map<string, { socketId: string, status: string }>();

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("user:online", async (userData: { uid: string, name: string }) => {
      onlineUsers.set(userData.uid, { socketId: socket.id, status: "online" });
      socket.data.uid = userData.uid;
      
      // Update Firestore presence
      await dbInstance.collection("users").doc(userData.uid).set({
        isOnline: true,
        lastSeen: new Date().toISOString()
      }, { merge: true });

      io.emit("presence:update", Array.from(onlineUsers.entries()));
      console.log(`User ${userData.uid} is online`);
    });

    socket.on("message:send", (payload) => {
      // Broadcast to specific room (matchId)
      io.to(payload.matchId).emit("message:received", payload);
    });

    socket.on("room:join", (matchId) => {
      socket.join(matchId);
      console.log(`Socket ${socket.id} joined match room ${matchId}`);
    });

    socket.on("disconnect", async () => {
      const uid = socket.data.uid;
      if (uid) {
        onlineUsers.delete(uid);
        await dbInstance.collection("users").doc(uid).set({
          isOnline: false,
          lastSeen: new Date().toISOString()
        }, { merge: true });
        
        io.emit("presence:update", Array.from(onlineUsers.entries()));
        console.log(`User ${uid} disconnected`);
      }
    });
  });

  // API Routes
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Sophisticated Matching Endpoint
  app.post("/api/match/find", async (req, res) => {
    const { uid, tags, intensity } = req.body;
    
    try {
      // 1. Get all online users (excluding self)
      const usersSnapshot = await dbInstance.collection("users")
        .where("isOnline", "==", true)
        .limit(50)
        .get();

      const candidates: any[] = [];
      usersSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.uid !== uid) {
          candidates.push(data);
        }
      });

      // 2. Scoring Algorithm
      // Perfect match = same tags + similar intensity
      const scoredCandidates = candidates.map(c => {
        let score = 0;
        const sharedTags = tags.filter((t: string) => c.tags?.includes(t));
        score += sharedTags.length * 10;
        
        const intensityDiff = Math.abs(intensity - (c.intensity || 5));
        score += (10 - intensityDiff);

        return { ...c, score };
      }).sort((a, b) => b.score - a.score);

      const bestMatch = scoredCandidates[0];

      if (bestMatch && bestMatch.score > 5) {
        // Create a match document
        const matchId = [uid, bestMatch.uid].sort().join("_");
        const matchDoc = {
          id: matchId,
          participants: [uid, bestMatch.uid],
          tags: bestMatch.tags,
          status: "active",
          createdAt: new Date().toISOString()
        };

        await dbInstance.collection("matches").doc(matchId).set(matchDoc);
        res.json({ match: matchDoc });
      } else {
        res.json({ match: null, message: "No suitable human match found. Try our AI companion?" });
      }
    } catch (error) {
      console.error("Match error:", error);
      res.status(500).json({ error: "Failed to find match" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
