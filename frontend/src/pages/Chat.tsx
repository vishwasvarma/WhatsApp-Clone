import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiChevronDown,
  FiMoreVertical,
  FiPaperclip,
  FiSearch,
  FiSend,
  FiSmile,
  FiMessageSquare,
  FiCamera,
  FiBookmark,
  FiFileText,
  FiImage,
  FiMapPin,
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
  // start with no messages
  const [messagesByChat, setMessagesByChat] = useState<Record<string, any[]>>(
    {},
  );
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "groups">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    chat: string;
    id: string;
  } | null>(null);

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

  // update contact preview when messages change
  useEffect(() => {
    setContacts((prev) =>
      prev.map((c) => {
        const msgs = messagesByChat[c.name] || [];
        if (msgs.length === 0) return c;
        const last = msgs[msgs.length - 1].text || c.last;
        return { ...c, last };
      }),
    );
  }, [messagesByChat]);

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
    // update contact preview
    setContacts((prev) =>
      prev.map((c) => (c.name === selected ? { ...c, last: msg.text } : c)),
    );
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

  const handleDeleteConfirmed = async (chat: string, id: string) => {
    setMessagesByChat((prev) => ({
      ...(prev || {}),
      [chat]: (prev[chat] || []).filter((m) => m.id !== id),
    }));
    setDeleteModal(null);
    try {
      await fetch(`http://localhost:5001/api/message/${id}`, {
        method: "DELETE",
      });
    } catch (e) {}
  };

  const requestDelete = (chat: string, id: string) => {
    setDeleteModal({ chat, id });
  };

  const selectChat = (name: string) => {
    setSelected(name);
    setContacts((prev) =>
      prev.map((c) => (c.name === name ? { ...c, unread: 0 } : c)),
    );
  };

  const navItems = [
    { to: "/chat", icon: FiMessageSquare, label: "Chats" },
    { to: "/stories", icon: FiCamera, label: "Stories" },
    { to: "/highlights", icon: FiBookmark, label: "Highlights" },
    { to: "/profile", icon: FiUser, label: "Profile" },
    { to: "/settings", icon: FiSettings, label: "Settings" },
  ];

  const filteredContacts = contacts
    .filter((c) => {
      if (filter === "all") return true;
      if (filter === "unread") return (c.unread || 0) > 0;
      if (filter === "groups") return c.name.toLowerCase().includes("group");
      return true;
    })
    .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm placeholder:text-slate-500 outline-none"
                placeholder="Search or start new chat"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-3 text-sm text-slate-400">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full border border-slate-800 px-3 py-2 ${filter === "all" ? "bg-slate-800 text-slate-100" : "bg-slate-900 text-slate-400"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`rounded-full border border-slate-800 px-3 py-2 ${filter === "unread" ? "bg-slate-800 text-slate-100" : "bg-slate-900 text-slate-400"}`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter("groups")}
              className={`rounded-full border border-slate-800 px-3 py-2 ${filter === "groups" ? "bg-slate-800 text-slate-100" : "bg-slate-900 text-slate-400"}`}
            >
              Groups
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            {filteredContacts.map((contact) => (
              <button
                key={contact.name}
                onClick={() => selectChat(contact.name)}
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
              <Link
                to="/settings"
                className="rounded-2xl border border-slate-800 bg-slate-950 p-3 transition hover:bg-slate-800"
              >
                <FiMoreVertical size={18} />
              </Link>
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
                    requestDelete(selected, m.id);
                  }}
                  className={`max-w-[70%] ${m.sender === "me" ? "self-end rounded-[28px] rounded-bl-none bg-emerald-500 text-white" : "self-start rounded-[28px] rounded-br-none bg-slate-800 text-slate-100"} px-5 py-3 text-sm shadow-sm`}
                >
                  {m.text}
                </div>
              ))}
            </div>
          </div>

          <div className="relative border-t border-slate-800 bg-slate-950 px-5 py-4">
            {attachmentOpen ? (
              <div className="absolute left-5 right-5 -top-40 z-20 rounded-3xl border border-slate-800 bg-slate-950 p-4 shadow-2xl">
                <div className="grid grid-cols-4 gap-3">
                  <button className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-slate-800 bg-slate-900 p-3 text-slate-200 transition hover:bg-slate-800">
                    <FiFileText size={20} />
                    <span className="text-[11px] uppercase tracking-[0.2em]">
                      Doc
                    </span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-slate-800 bg-slate-900 p-3 text-slate-200 transition hover:bg-slate-800">
                    <FiImage size={20} />
                    <span className="text-[11px] uppercase tracking-[0.2em]">
                      Photo
                    </span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-slate-800 bg-slate-900 p-3 text-slate-200 transition hover:bg-slate-800">
                    <FiMapPin size={20} />
                    <span className="text-[11px] uppercase tracking-[0.2em]">
                      Location
                    </span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-slate-800 bg-slate-900 p-3 text-slate-200 transition hover:bg-slate-800">
                    <FiSmile size={20} />
                    <span className="text-[11px] uppercase tracking-[0.2em]">
                      Reaction
                    </span>
                  </button>
                </div>
              </div>
            ) : null}
            <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900 px-4 py-3">
              <button
                onClick={() => setAttachmentOpen((prev) => !prev)}
                className="rounded-full p-3 text-slate-400 transition hover:bg-slate-800"
              >
                <FiPaperclip size={18} />
              </button>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                placeholder="Type a message"
              />
              <button
                onClick={sendMessage}
                className="rounded-full bg-emerald-500 p-3 text-white transition hover:bg-emerald-400"
              >
                <FiSend size={18} />
              </button>
            </div>
          </div>
        </main>
      </div>
      {/* delete confirmation modal */}
      {deleteModal ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-slate-900 p-4 text-slate-100">
            <p className="mb-4">This message should be deleted. Proceed?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="rounded-lg border border-slate-700 px-3 py-1"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  deleteModal &&
                  handleDeleteConfirmed(deleteModal.chat, deleteModal.id)
                }
                className="rounded-lg bg-rose-600 px-3 py-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ChatPage;
