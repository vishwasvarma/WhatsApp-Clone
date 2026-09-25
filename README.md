# WhatsApp Clone

WhatsApp-inspired web app with real-time chat and five extra features. Data lives in memory on the local Node.js server.

## Features

- Invisible message delete (no "This message was deleted" placeholder)
- Scheduled messages
- One-time view stories
- Birthday reminders (notification only, no auto wishes)
- Instagram-style highlights

## Run locally

Use two terminals.

Terminal 1 — backend:

```bash
cd D:\wApp\WhatsApp-Clone\backend
npm install
npm run dev
```

Backend: http://localhost:5000

Terminal 2 — frontend:

```bash
cd D:\wApp\WhatsApp-Clone\frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Test with two accounts

1. Open http://localhost:5173 and register User A (include a birthday).
2. Open a second browser tab, register User B.
3. Log in as A in tab 1 and B in tab 2.
4. Select the other contact and send messages both ways.
5. Right-click or double-click a message to delete it completely.
6. Use the clock icon to schedule a message a minute ahead.
7. Upload a status in Stories. The other user can open it only once.
8. While viewing a story, add it to a Highlight.
9. Set a contact birthday to tomorrow to see a birthday reminder.

Stopping the backend clears all in-memory data.
