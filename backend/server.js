import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cron from "node-cron";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads", "chats");
fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed"));
      return;
    }
    cb(null, true);
  },
});

const chatAttachmentUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, "_");
      cb(null, `${uid()}-${safe}`);
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024 },
});

const users = [];
const chats = [];
const messages = [];
const stories = [];
const highlights = [];
const scheduledMessages = [];
const notifications = [];

const STORY_TTL_MS = 24 * 60 * 60 * 1000;

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function publicUser(user) {
  if (!user) return null;
  const { password: _password, socketId: _socketId, ...rest } = user;
  return rest;
}

function publicUsers() {
  return users.map(publicUser);
}

function chatIdFor(a, b) {
  return [a, b].sort().join("::");
}

function monthDay(dateLike) {
  const d = new Date(dateLike);
  return `${d.getMonth() + 1}-${d.getDate()}`;
}

function isSameMonthDay(a, b) {
  return monthDay(a) === monthDay(b);
}

function emitToUser(userId, event, payload) {
  io.to(`user:${userId}`).emit(event, payload);
}

function emitToChat(senderId, receiverId, event, payload) {
  emitToUser(senderId, event, payload);
  if (receiverId && receiverId !== senderId) {
    emitToUser(receiverId, event, payload);
  }
}

function findUserById(id) {
  return users.find((entry) => entry.id === id);
}

function findUserByName(username) {
  return users.find(
    (entry) => entry.username.toLowerCase() === String(username).toLowerCase(),
  );
}

function isStoryExpired(story) {
  return Date.now() - Number(story.createdAt) > STORY_TTL_MS;
}

function withStoryFlags(story, viewerId) {
  return {
    ...story,
    expired: isStoryExpired(story),
    viewedByMe: Boolean(viewerId && (story.viewedBy || []).includes(viewerId)),
    canView:
      Boolean(viewerId) &&
      (story.senderId === viewerId ||
        !(story.viewedBy || []).includes(viewerId)) &&
      !isStoryExpired(story),
  };
}

function ensureChat(senderId, receiverId) {
  const id = chatIdFor(senderId, receiverId);
  let chat = chats.find((entry) => entry.id === id);
  if (!chat) {
    chat = { id, users: [senderId, receiverId] };
    chats.push(chat);
  }
  return chat;
}

function createMessage({
  senderId,
  receiverId,
  text,
  scheduled = false,
  sharedContactId,
  attachment,
}) {
  const sender = findUserById(senderId);
  const receiver = findUserById(receiverId);
  if (!sender || !receiver) return null;
  const sharedContact = sharedContactId
    ? findUserById(sharedContactId)
    : null;
  if (sharedContactId && !sharedContact) return null;
  const trimmed = String(text || "").trim();
  if (!trimmed) return null;

  const message = {
    id: uid(),
    sender: sender.username,
    senderId: sender.id,
    receiver: receiver.username,
    receiverId: receiver.id,
    chat: chatIdFor(sender.id, receiver.id),
    text: trimmed,
    time: Date.now(),
    scheduled: Boolean(scheduled),
    ...(sharedContact
      ? {
          sharedContact: {
            id: sharedContact.id,
            username: sharedContact.username,
            about: sharedContact.about,
          },
        }
      : {}),
    ...(attachment ? { attachment } : {}),
  };
  messages.push(message);
  ensureChat(sender.id, receiver.id);
  emitToChat(sender.id, receiver.id, "receive-message", message);
  return message;
}

function ensureBirthdayReminders() {
  const now = new Date();
  const reminderTime = new Date(now);
  reminderTime.setHours(15, 0, 0, 0);
  if (now < reminderTime) return [];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const created = [];

  users.forEach((person) => {
    if (!person.birthday) return;
    if (!isSameMonthDay(person.birthday, tomorrow)) return;

    users.forEach((viewer) => {
      if (viewer.id === person.id) return;
      if (viewer.birthdayRemindersEnabled === false) return;
      const already = notifications.find(
        (entry) =>
          entry.type === "birthday" &&
          entry.userId === viewer.id &&
          entry.aboutUserId === person.id &&
          isSameMonthDay(entry.createdAt, now.getTime()),
      );
      if (already) return;

      const notification = {
        id: uid(),
        userId: viewer.id,
        aboutUserId: person.id,
        text: `${person.username}'s birthday is tomorrow.`,
        type: "birthday",
        createdAt: now.getTime(),
        read: false,
      };
      notifications.push(notification);
      emitToUser(viewer.id, "birthday-notification", notification);
      created.push(notification);
    });
  });

  return created;
}

function processScheduledMessages() {
  const now = Date.now();
  scheduledMessages.forEach((entry) => {
    if (entry.status !== "pending") return;
    if (new Date(entry.sendAt).getTime() > now) return;
    const message = createMessage({
      senderId: entry.senderId,
      receiverId: entry.receiverId,
      text: entry.text,
      scheduled: true,
    });
    entry.status = message ? "sent" : "failed";
    entry.sentAt = Date.now();
    entry.messageId = message?.id || null;
    emitToUser(entry.senderId, "schedule-sent", entry);
  });
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/register", (req, res) => {
  const { username, password, birthday } = req.body || {};
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  if (findUserByName(username)) {
    return res.status(409).json({ error: "Username is already taken" });
  }
  const user = {
    id: uid(),
    username: String(username).trim(),
    password: String(password),
    birthday: birthday || "",
    about: "Hey there! I am using WhatsApp.",
    messageNotifications: true,
    birthdayRemindersEnabled: true,
    invisibleDeleteEnabled: true,
    online: false,
    socketId: null,
  };
  users.push(user);
  ensureBirthdayReminders();
  io.emit("users-updated", publicUsers());
  res.json({ success: true, user: publicUser(user) });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  const user = users.find(
    (entry) =>
      entry.username.toLowerCase() === String(username || "").toLowerCase() &&
      entry.password === String(password || ""),
  );
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  user.online = true;
  ensureBirthdayReminders();
  io.emit("users-updated", publicUsers());
  res.json({ success: true, user: publicUser(user) });
});

app.post("/api/logout", (req, res) => {
  const user = findUserById(req.body?.userId);
  if (user) {
    user.online = false;
    user.socketId = null;
    io.emit("users-updated", publicUsers());
  }
  res.json({ success: true });
});

app.get("/api/users", (_req, res) => res.json(publicUsers()));

app.patch("/api/users/:id", (req, res) => {
  const user = findUserById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (typeof req.body?.birthday === "string") user.birthday = req.body.birthday;
  if (typeof req.body?.about === "string") user.about = req.body.about;
  for (const setting of [
    "messageNotifications",
    "birthdayRemindersEnabled",
    "invisibleDeleteEnabled",
  ]) {
    if (typeof req.body?.[setting] === "boolean") {
      user[setting] = req.body[setting];
      if (setting === "birthdayRemindersEnabled" && !req.body[setting]) {
        notifications.forEach((entry) => {
          if (entry.userId === user.id && entry.type === "birthday") {
            entry.read = true;
          }
        });
      }
    }
  }
  ensureBirthdayReminders();
  io.emit("users-updated", publicUsers());
  res.json(publicUser(user));
});

app.get("/api/chats", (_req, res) => res.json(chats));

app.get("/api/messages", (req, res) => {
  const userId = String(req.query.userId || "");
  if (!userId) return res.json(messages);
  res.json(
    messages.filter(
      (entry) => entry.senderId === userId || entry.receiverId === userId,
    ),
  );
});

app.post("/api/message", (req, res) => {
  const message = createMessage({
    senderId: req.body?.senderId,
    receiverId: req.body?.receiverId,
    text: req.body?.text,
    sharedContactId: req.body?.sharedContactId,
  });
  if (!message) {
    return res.status(400).json({ error: "Unable to send message" });
  }
  res.json(message);
});

app.post(
  "/api/chat-attachment",
  chatAttachmentUpload.single("file"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: "File is required" });
    const message = createMessage({
      senderId: req.body?.senderId,
      receiverId: req.body?.receiverId,
      text: req.file.originalname,
      attachment: {
        name: req.file.originalname,
        url: `/uploads/chats/${req.file.filename}`,
        mimeType: req.file.mimetype || "application/octet-stream",
        size: req.file.size,
      },
    });
    if (!message) {
      fs.unlink(req.file.path, (error) => {
        if (error) console.error("Could not remove rejected chat attachment", error);
      });
      return res.status(400).json({ error: "Invalid sender, recipient, or file" });
    }
    res.json(message);
  },
);

app.delete("/api/message/:id", (req, res) => {
  const user = findUserById(req.body?.userId);
  if (!user) return res.status(400).json({ error: "Invalid user" });
  if (user.invisibleDeleteEnabled === false) {
    return res.status(403).json({ error: "Delete-for-everyone is disabled in Privacy settings" });
  }
  const index = messages.findIndex((entry) => entry.id === req.params.id);
  if (index < 0) return res.status(404).json({ error: "Message not found" });
  const message = messages[index];
  if (message.senderId !== user.id && message.receiverId !== user.id) {
    return res.status(403).json({ error: "You cannot delete this message" });
  }
  const [removed] = messages.splice(index, 1);
  emitToChat(removed.senderId, removed.receiverId, "message-deleted", {
    id: removed.id,
    chat: removed.chat,
  });
  res.json({ success: true });
});

app.post("/api/story", upload.single("image"), (req, res) => {
  const sender = findUserById(req.body?.senderId);
  if (!sender) return res.status(400).json({ error: "Invalid sender" });
  if (!req.file) return res.status(400).json({ error: "Image is required" });
  const story = {
    id: uid(),
    sender: sender.username,
    senderId: sender.id,
    image: `/uploads/chats/${req.file.filename}`,
    createdAt: Date.now(),
    viewedBy: [],
  };
  stories.push(story);
  io.emit("story-uploaded", withStoryFlags(story));
  res.json(withStoryFlags(story, sender.id));
});

app.get("/api/stories", (req, res) => {
  const viewerId = String(req.query.userId || "");
  res.json(stories.map((story) => withStoryFlags(story, viewerId)));
});

app.get("/api/stories/:id", (req, res) => {
  const story = stories.find((entry) => entry.id === req.params.id);
  if (!story) return res.status(404).json({ error: "Story not found" });
  res.json(withStoryFlags(story, String(req.query.userId || "")));
});

app.post("/api/story/:id/view", (req, res) => {
  const story = stories.find((entry) => entry.id === req.params.id);
  if (!story) return res.status(404).json({ error: "Story not found" });
  if (isStoryExpired(story)) {
    return res.status(410).json({ error: "Story unavailable" });
  }
  const userId = String(req.body?.userId || "");
  if (!userId) return res.status(400).json({ error: "userId is required" });
  const isOwner = story.senderId === userId;
  if (!isOwner && (story.viewedBy || []).includes(userId)) {
    return res.status(403).json({
      error: "Story unavailable",
      viewed: true,
      story: withStoryFlags(story, userId),
    });
  }
  if (!isOwner) {
    story.viewedBy = [...(story.viewedBy || []), userId];
  }
  const payload = withStoryFlags(story, userId);
  io.emit("story-viewed", payload);
  res.json(payload);
});

app.delete("/api/story/:id", (req, res) => {
  const story = stories.find((entry) => entry.id === req.params.id);
  if (!story) return res.status(404).json({ error: "Story not found" });
  const userId = String(req.body?.userId || "");
  if (story.senderId !== userId) {
    return res.status(403).json({ error: "Only the story owner can delete it" });
  }
  const index = stories.indexOf(story);
  stories.splice(index, 1);
  io.emit("story-deleted", { id: story.id });
  res.json({ success: true });
});

app.post("/api/highlight", (req, res) => {
  const user = findUserById(req.body?.userId);
  const story = stories.find((entry) => entry.id === req.body?.storyId);
  if (!user) return res.status(400).json({ error: "Invalid user" });
  if (!story) return res.status(400).json({ error: "Story not found" });
  if (story.senderId !== user.id) {
    return res.status(403).json({ error: "Only the story owner can add it to highlights" });
  }

  const title = String(req.body?.title || "Memories").trim() || "Memories";
  const savedByUserId = user.id;
  const existing = highlights.find(
    (entry) =>
      (entry.savedByUserId ?? entry.userId) === savedByUserId &&
      entry.storyId === story.id,
  );
  if (existing) return res.json(existing);

  const highlight = {
    id: uid(),
    user: user.username,
    userId: savedByUserId,
    savedByUserId,
    story: story.id,
    storyId: story.id,
    storyOwnerId: story.senderId,
    storyOwner: story.sender,
    title,
    image: story.image,
    sender: story.sender,
    createdAt: Date.now(),
  };
  highlights.push(highlight);
  emitToUser(user.id, "highlight-created", highlight);
  res.json(highlight);
});

app.get("/api/highlights", (req, res) => {
  const userId = String(req.query.userId || "");
  if (!userId) return res.json(highlights);
  res.json(
    highlights.filter((entry) => (entry.savedByUserId ?? entry.userId) === userId),
  );
});

app.delete("/api/highlight/:id", (req, res) => {
  const index = highlights.findIndex((entry) => entry.id === req.params.id);
  if (index >= 0) highlights.splice(index, 1);
  res.json({ success: true });
});

app.post("/api/schedule", (req, res) => {
  const sender = findUserById(req.body?.senderId);
  const receiver = findUserById(req.body?.receiverId);
  const text = String(req.body?.text || "").trim();
  const sendAt = new Date(req.body?.sendAt || "").getTime();
  if (!sender || !receiver || !text) {
    return res.status(400).json({ error: "Invalid scheduled message" });
  }
  if (!sendAt || Number.isNaN(sendAt) || sendAt <= Date.now()) {
    return res
      .status(400)
      .json({ error: "Please choose a future date and time" });
  }
  const schedule = {
    id: uid(),
    sender: sender.username,
    senderId: sender.id,
    receiver: receiver.username,
    receiverId: receiver.id,
    text,
    sendAt,
    status: "pending",
    createdAt: Date.now(),
  };
  scheduledMessages.push(schedule);
  emitToUser(sender.id, "schedule-created", schedule);
  res.json(schedule);
});

app.get("/api/schedule", (req, res) => {
  const userId = String(req.query.userId || "");
  if (!userId) return res.json(scheduledMessages);
  res.json(scheduledMessages.filter((entry) => entry.senderId === userId));
});

app.delete("/api/schedule/:id", (req, res) => {
  const entry = scheduledMessages.find((item) => item.id === req.params.id);
  if (!entry) return res.status(404).json({ error: "Not found" });
  if (entry.status !== "pending") {
    return res.status(400).json({ error: "Only pending messages can be cancelled" });
  }
  entry.status = "cancelled";
  emitToUser(entry.senderId, "schedule-cancelled", entry);
  res.json({ success: true });
});

app.get("/api/notifications", (req, res) => {
  ensureBirthdayReminders();
  const userId = String(req.query.userId || "");
  if (!userId) return res.json(notifications);
  res.json(notifications.filter((entry) => entry.userId === userId));
});

app.patch("/api/notifications/:id/read", (req, res) => {
  const entry = notifications.find((item) => item.id === req.params.id);
  if (entry) entry.read = true;
  res.json(entry || { success: true });
});

app.use((err, _req, res, _next) => {
  if (err) return res.status(400).json({ error: err.message });
  return res.status(500).json({ error: "Server error" });
});

io.on("connection", (socket) => {
  socket.on("identify", ({ userId }) => {
    const user = findUserById(userId);
    socket.data.userId = userId;
    socket.join(`user:${userId}`);
    if (user) {
      user.online = true;
      user.socketId = socket.id;
      io.emit("users-updated", publicUsers());
    }
  });

  socket.on("join-chat", (data) => {
    if (data?.chatId) socket.join(data.chatId);
  });

  socket.on("typing", (data) => {
    if (data?.receiverId) {
      emitToUser(data.receiverId, "typing", data);
    } else {
      socket.broadcast.emit("typing", data);
    }
  });

  socket.on("stop-typing", (data) => {
    if (data?.receiverId) {
      emitToUser(data.receiverId, "stop-typing", data);
    } else {
      socket.broadcast.emit("stop-typing", data);
    }
  });

  socket.on("disconnect", () => {
    const userId = socket.data.userId;
    if (!userId) return;
    const room = io.sockets.adapter.rooms.get(`user:${userId}`);
    if (!room || room.size === 0) {
      const user = findUserById(userId);
      if (user) {
        user.online = false;
        user.socketId = null;
        io.emit("users-updated", publicUsers());
      }
    }
  });
});

cron.schedule("* * * * *", () => {
  processScheduledMessages();
  ensureBirthdayReminders();
});

cron.schedule("0 9 * * *", () => {
  ensureBirthdayReminders();
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
