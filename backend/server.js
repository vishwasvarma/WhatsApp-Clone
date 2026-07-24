import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import cron from "node-cron";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "uploads", "chats")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const users = [];
const chats = [];
const messages = [];
const stories = [];
const highlights = [];
const scheduledMessages = [];
const notifications = [];

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.post("/api/register", (req, res) => {
  const { username, password, birthday } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  users.push({
    id: `${Date.now()}`,
    username,
    password,
    birthday,
    online: true,
  });
  res.json({ success: true });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (entry) => entry.username === username && entry.password === password,
  );
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  user.online = true;
  res.json({ success: true, user });
});

app.get("/api/users", (req, res) => res.json(users));

app.get("/api/messages", (req, res) => res.json(messages));

app.post("/api/message", (req, res) => {
  const message = { id: `${Date.now()}`, ...req.body };
  messages.push(message);
  io.emit("receive-message", message);
  res.json(message);
});

app.delete("/api/message/:id", (req, res) => {
  const id = req.params.id;
  const index = messages.findIndex((message) => message.id === id);
  if (index >= 0) {
    messages.splice(index, 1);
    io.emit("message-deleted", { id });
  }
  res.json({ success: true });
});

app.post("/api/story", upload.single("image"), (req, res) => {
  const story = {
    id: `${Date.now()}`,
    ...req.body,
    image: req.file ? `/uploads/chats/${req.file.filename}` : null,
  };
  stories.push(story);
  io.emit("story-uploaded", story);
  res.json(story);
});

app.get("/api/stories", (req, res) => res.json(stories));
app.delete("/api/story/:id", (req, res) => {
  const id = req.params.id;
  const index = stories.findIndex((story) => story.id === id);
  if (index >= 0) stories.splice(index, 1);
  res.json({ success: true });
});

app.post("/api/highlight", (req, res) => {
  const highlight = { id: `${Date.now()}`, ...req.body };
  highlights.push(highlight);
  res.json(highlight);
});

app.get("/api/highlights", (req, res) => res.json(highlights));

app.post("/api/schedule", (req, res) => {
  const schedule = { id: `${Date.now()}`, ...req.body, status: "pending" };
  scheduledMessages.push(schedule);
  res.json(schedule);
});

app.get("/api/schedule", (req, res) => res.json(scheduledMessages));

io.on("connection", (socket) => {
  socket.on("join-chat", (data) => socket.join(data.chatId || "general"));
  socket.on("send-message", (message) => {
    messages.push(message);
    io.emit("receive-message", message);
  });
  socket.on("typing", (data) => socket.broadcast.emit("typing", data));
  socket.on("stop-typing", (data) =>
    socket.broadcast.emit("stop-typing", data),
  );
  socket.on("delete-message", (data) => {
    const index = messages.findIndex((message) => message.id === data.id);
    if (index >= 0) {
      messages.splice(index, 1);
      io.emit("message-deleted", { id: data.id });
    }
  });
  socket.on("story-view", (data) => {
    const story = stories.find((entry) => entry.id === data.id);
    if (story) {
      story.viewedBy = [...(story.viewedBy || []), data.userId];
      io.emit("story-viewed", story);
    }
  });
  socket.on("schedule-message", (schedule) => {
    scheduledMessages.push({ ...schedule, status: "pending" });
    io.emit("schedule-created", schedule);
  });
  socket.on("disconnect", () => {
    const user = users.find((entry) => entry.socketId === socket.id);
    if (user) user.online = false;
  });
});

cron.schedule("* * * * *", () => {
  const now = new Date();
  scheduledMessages.forEach((entry) => {
    if (entry.status === "pending" && new Date(entry.sendAt) <= now) {
      entry.status = "sent";
      io.emit("receive-message", {
        id: `${Date.now()}`,
        text: entry.text,
        sender: entry.sender,
        receiver: entry.receiver,
      });
    }
  });
});

cron.schedule("0 9 * * *", () => {
  notifications.push({
    id: `${Date.now()}`,
    text: "Daily reminder: check your local stories and messages.",
  });
  io.emit("birthday-notification", notifications[notifications.length - 1]);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
