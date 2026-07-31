import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiChevronDown,
  FiMoreVertical,
  FiPaperclip,
  FiPhone,
  FiSearch,
  FiSend,
  FiSmile,
  FiVideo,
  FiMessageSquare,
  FiCamera,
  FiBookmark,
  FiCalendar,
  FiUser,
  FiSettings,
} from "react-icons/fi";

const initialContacts = [
  { name: "Ravi Teja", last: "Hey, are you free today?", unread: 3 },
  { name: "Ankur Pranav", last: "Sure, let's do it", unread: 0 },
  { name: "Mira Sharma", last: "Typing...", unread: 0 },
  { name: "Group Chat", last: "Meeting at 4 PM", unread: 5 },
];

function ChatPage() {
  const [contacts, setContacts] = useState(initialContacts);
  const [selected, setSelected] = useState(initialContacts[0].name);
  const [messagesByChat, setMessagesByChat] = useState<Record<string, any[]>>({
    [initialContacts[0].name]: [
      {
        id: `${Date.now() - 20000}`,
        sender: "them",
        text: "Hello, this is your dark chat view.",
        time: Date.now() - 20000,
      },
      {
        id: `${Date.now() - 10000}`,
        sender: "me",
        text: "I’m building the WhatsApp sidebar and chat panel.",
        time: Date.now() - 10000,
      },
    ],
  });
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // ensure selected chat has an array
    setMessagesByChat((prev) => ({
      ...(prev || {}),
      [selected]: prev[selected] || [],
    }));
  }, [selected]);

  useEffect(() => {
    // scroll to bottom on messages change
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messagesByChat, selected]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const msg = {
      id: `${Date.now()}`,
      sender: "me",
      text: text.trim(),
      time: Date.now(),
    };
    setMessagesByChat((prev) => ({
      ...(prev || {}),
      [selected]: [...(prev[selected] || []), msg],
    }));
    setText("");
    try {
      await fetch("http://localhost:5001/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...msg, chat: selected }),
      });
    } catch (e) {
      // ignore network errors for now
    }
  };

  const handleDelete = async (chat: string, id: string) => {
    const ok = window.confirm("Delete this message?");
    if (!ok) return;
    setMessagesByChat((prev) => ({
      ...(prev || {}),
      [chat]: (prev[chat] || []).filter((m) => m.id !== id),
    }));
    try {
      await fetch(`http://localhost:5001/api/message/${id}`, {
        method: "DELETE",
      });
    } catch (e) {}
  };

  const navItems = [
    { to: "/chat", icon: FiMessageSquare, label: "Chats" },
    { to: "/stories", icon: FiCamera, label: "Stories" },
    { to: "/highlights", icon: FiBookmark, label: "Highlights" },
    { to: "/schedule", icon: FiCalendar, label: "Schedule" },
    { to: "/profile", icon: FiUser, label: "Profile" },
    { to: "/settings", icon: FiSettings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen text-slate-100">
      <div className="mx-auto flex min-h-[92vh] max-w-[1600px] overflow-hidden rounded-[30px] border border-slate-800 bg-slate-900 shadow-2xl sm:min-h-[90vh]">
        <aside className="hidden w-[360px] flex-col border-r border-slate-800 bg-slate-950 lg:flex">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid gap-2">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  WhatsApp
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-white">Chat</h1>
              </div>
            </div>
            <Link
              to="/"
              className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-200 transition hover:bg-slate-800"
            >
              <FiChevronDown size={20} />
            </Link>
          </div>

          <div className="flex gap-2 px-5 py-4">
            {navItems.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                title={label}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-3 text-slate-200 transition hover:bg-slate-800"
              >
                <Icon size={18} />
              </Link>
            ))}
          </div>

          <div className="border-b border-slate-800 px-5 py-4">
            <div className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900 p-3 text-slate-400">
              <FiSearch />
              <input
                className="w-full bg-transparent text-sm placeholder:text-slate-500 outline-none"
                placeholder="Search or start new chat"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-3 text-sm text-slate-400">
            <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-2 text-slate-100">
              All
            </span>
            <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-2">
              Unread
            </span>
            <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-2">
              Groups
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            {contacts.map((contact) => (
              <button
                key={contact.name}
                onClick={() => setSelected(contact.name)}
                className={`mb-3 flex w-full items-start gap-3 rounded-3xl px-4 py-3 text-left transition hover:bg-slate-800 ${selected === contact.name ? "bg-slate-800" : "bg-slate-950"}`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
                  {contact.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-white">
                      {contact.name}
                    </p>
                    {contact.unread > 0 ? (
                      <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-semibold text-slate-950">
                        {contact.unread}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-sm text-slate-400">
                    {contact.last}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-800 px-5 py-4 text-sm text-slate-500">
            <p className="font-medium text-slate-300">Recent</p>
            <div className="mt-3 grid gap-3">
              <button className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-left text-sm transition hover:bg-slate-800">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300">
                  +
                </span>
                <div>
                  <p className="font-semibold text-white">New group</p>
                  <p className="text-slate-500">Create a new community</p>
                </div>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex flex-1 flex-col bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.03)_0%,_transparent_25%),linear-gradient(180deg,_#0f1419_0%,_#111827_100%)] bg-[length:120px_120px] bg-[position:0_0]">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-lg font-semibold text-white">
                {selected[0]}
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{selected}</p>
                <p className="text-sm text-slate-400">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <button className="rounded-2xl border border-slate-800 bg-slate-950 p-3 transition hover:bg-slate-800">
                <FiPhone size={18} />
              </button>
              <button className="rounded-2xl border border-slate-800 bg-slate-950 p-3 transition hover:bg-slate-800">
                <FiVideo size={18} />
              </button>
              <button className="rounded-2xl border border-slate-800 bg-slate-950 p-3 transition hover:bg-slate-800">
                <FiMoreVertical size={18} />
              </button>
            </div>
          </div>

          <div className="relative flex-1 overflow-y-auto px-5 py-6">
            <div
              ref={listRef}
              className="mx-auto flex max-w-4xl flex-col gap-3"
            >
              {(messagesByChat[selected] || []).map((m) => (
                <div
                  key={m.id}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleDelete(selected, m.id);
                  }}
                  className={`max-w-[70%] ${m.sender === "me" ? "self-end rounded-[28px] rounded-bl-none bg-emerald-500 text-white" : "self-start rounded-[28px] rounded-br-none bg-slate-800 text-slate-100"} px-5 py-3 text-sm shadow-sm`}
                >
                  {m.text}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800 bg-slate-950 px-5 py-4">
            <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900 px-4 py-3">
              <button className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800">
                <FiPaperclip size={18} />
              </button>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                className="flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                placeholder="Type a message"
              />
              <button className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800">
                <FiSmile size={18} />
              </button>
              <button
                onClick={sendMessage}
                className="rounded-full bg-emerald-500 p-2 text-white transition hover:bg-emerald-400"
              >
                <FiSend size={18} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ChatPage;
