import { useEffect, useMemo, useRef, useState } from "react";
import { MdSearch, MdMoreVert, MdLock } from "react-icons/md";
import AppShell from "../components/AppShell";
import ChatList, { type ChatPreview } from "../components/ChatList";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import DeleteConfirm from "../components/DeleteConfirm";
import ScheduleModal from "../components/ScheduleModal";
import BirthdayNotification from "../components/BirthdayNotification";
import Avatar from "../components/Avatar";
import { useApp } from "../context/AppContext";
import { api } from "../services/api";
import socket from "../socket/socket";
import type { Message, ScheduledMessage, User } from "../types";

function ChatPage() {
  const { user, users, notifications, markNotificationRead } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [scheduled, setScheduled] = useState<ScheduledMessage[]>([]);
  const [selected, setSelected] = useState<User | null>(null);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [unread, setUnread] = useState<Record<string, number>>({});
  const [typing, setTyping] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [toast, setToast] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const typingTimer = useRef<number | null>(null);

  const contacts = useMemo(
    () => users.filter((entry) => entry.id !== user?.id),
    [users, user],
  );

  const visibleMessages = messages.filter((item) => {
    if (!selected || !user) return false;
    return (
      (item.senderId === user.id && item.receiverId === selected.id) ||
      (item.senderId === selected.id && item.receiverId === user.id)
    );
  });

  const previews: ChatPreview[] = contacts
    .map((contact) => {
      const related = messages.filter(
        (item) =>
          (item.senderId === contact.id || item.receiverId === contact.id) &&
          (item.senderId === user?.id || item.receiverId === user?.id),
      );
      const last = related[related.length - 1];
      return {
        user: contact,
        last: last?.text,
        time: last?.time,
        unread: unread[contact.id] || 0,
      };
    })
    .filter((item) => item.user.username.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => (filter === "unread" ? item.unread > 0 : true))
    .sort((a, b) => (b.time || 0) - (a.time || 0));

  useEffect(() => {
    if (!user) return;
    void api.messages(user.id).then(setMessages);
    void api.schedules(user.id).then(setScheduled);
  }, [user]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visibleMessages.length, selected?.id]);

  useEffect(() => {
    if (!user) return;

    const onMessage = (message: Message) => {
      if (message.senderId !== user.id && message.receiverId !== user.id) return;
      setMessages((prev) =>
        prev.some((item) => item.id === message.id) ? prev : [...prev, message],
      );
      const otherId =
        message.senderId === user.id ? message.receiverId : message.senderId;
      if (message.senderId !== user.id && selected?.id !== otherId) {
        setUnread((prev) => ({ ...prev, [otherId]: (prev[otherId] || 0) + 1 }));
      }
    };
    const onDeleted = (data: { id: string }) => {
      setMessages((prev) => prev.filter((item) => item.id !== data.id));
    };
    const onTyping = (data: { senderId?: string }) => {
      if (data.senderId && data.senderId === selected?.id) setTyping(true);
    };
    const onStop = (data: { senderId?: string }) => {
      if (data.senderId && data.senderId === selected?.id) setTyping(false);
    };
    const onScheduled = (item: ScheduledMessage) => {
      if (item.senderId !== user.id) return;
      setScheduled((prev) =>
        prev.some((entry) => entry.id === item.id) ? prev : [item, ...prev],
      );
    };

    socket.on("receive-message", onMessage);
    socket.on("message-deleted", onDeleted);
    socket.on("typing", onTyping);
    socket.on("stop-typing", onStop);
    socket.on("schedule-created", onScheduled);
    socket.on("schedule-sent", onScheduled);
    return () => {
      socket.off("receive-message", onMessage);
      socket.off("message-deleted", onDeleted);
      socket.off("typing", onTyping);
      socket.off("stop-typing", onStop);
      socket.off("schedule-created", onScheduled);
      socket.off("schedule-sent", onScheduled);
    };
  }, [user, selected?.id]);

  if (!user) return null;

  const selectContact = (contact: User) => {
    setSelected(contact);
    setTyping(false);
    setUnread((prev) => ({ ...prev, [contact.id]: 0 }));
  };

  const sendMessage = async () => {
    if (!selected || !text.trim()) return;
    const payload = text.trim();
    setText("");
    emitTyping(false);
    try {
      const message = await api.sendMessage(user.id, selected.id, payload);
      setMessages((prev) =>
        prev.some((item) => item.id === message.id) ? prev : [...prev, message],
      );
    } catch (err) {
      setText(payload);
      setToast(err instanceof Error ? err.message : "Could not send");
    }
  };

  const emitTyping = (isTyping: boolean) => {
    if (!selected) return;
    socket.emit(isTyping ? "typing" : "stop-typing", {
      senderId: user.id,
      receiverId: selected.id,
      username: user.username,
    });
    if (typingTimer.current) window.clearTimeout(typingTimer.current);
    if (isTyping) {
      typingTimer.current = window.setTimeout(() => emitTyping(false), 1500);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
    setMessages((prev) => prev.filter((item) => item.id !== id));
    await api.deleteMessage(id);
  };

  const pendingForChat = scheduled.filter(
    (item) =>
      item.status === "pending" &&
      selected &&
      item.receiverId === selected.id,
  );

  return (
    <AppShell>
      <ChatList
        currentUserName={user.username}
        search={search}
        onSearch={setSearch}
        filter={filter}
        onFilter={setFilter}
        items={previews}
        selectedId={selected?.id}
        onSelect={selectContact}
      />
      <main className="flex min-w-0 flex-1 flex-col bg-wa-panel">
        {!selected ? (
          <div className="flex h-full flex-col items-center justify-center border-b-[6px] border-wa-accent bg-wa-bg text-center">
            <img src="/assets/icons/whatsapp.svg" alt="" className="h-16 w-16 opacity-80" />
            <h2 className="mt-6 text-3xl font-light text-wa-text">WhatsApp Web</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-wa-muted">
              Send and receive messages between two local accounts. Open another
              tab, register a second user, then select that contact to start chatting.
            </p>
            <p className="mt-8 flex items-center gap-2 text-xs text-wa-muted">
              <MdLock /> Local demo · messages stay in server memory
            </p>
          </div>
        ) : (
          <>
            <header className="flex items-center justify-between bg-wa-header px-4 py-2">
              <div className="flex items-center gap-3">
                <Avatar name={selected.username} online={selected.online} size={40} />
                <div>
                  <p className="text-[16px] text-wa-text">{selected.username}</p>
                  <p className="text-xs text-wa-muted">
                    {typing ? "typing..." : selected.online ? "online" : "offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-wa-icon">
                <MdSearch size={22} />
                <MdMoreVert size={22} />
              </div>
            </header>
            <div className="wa-wallpaper flex min-h-0 flex-1 flex-col">
              <BirthdayNotification
                items={notifications}
                onDismiss={(id) => void markNotificationRead(id)}
              />
              {pendingForChat.length > 0 ? (
                <div className="px-4 pt-3">
                  <div className="rounded-lg bg-[#182229] px-3 py-2 text-xs text-wa-muted">
                    {pendingForChat.length} scheduled message
                    {pendingForChat.length > 1 ? "s" : ""} waiting to send
                  </div>
                </div>
              ) : null}
              {toast ? (
                <div className="px-4 pt-3">
                  <div className="rounded-lg bg-[#182229] px-3 py-2 text-sm text-wa-accent">
                    {toast}
                  </div>
                </div>
              ) : null}
              <div
                ref={listRef}
                className="min-h-0 flex-1 overflow-y-auto"
              >
                <div className="mx-auto flex min-h-full w-full max-w-[840px] flex-col justify-end gap-1 px-8 py-3">
                {visibleMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    mine={message.senderId === user.id}
                    onDelete={setDeleteId}
                  />
                ))}
                </div>
              </div>
            </div>
            <MessageInput
              value={text}
              onChange={setText}
              onSend={() => void sendMessage()}
              onSchedule={() => setScheduleOpen(true)}
              onTyping={emitTyping}
            />
          </>
        )}
      </main>
      <DeleteConfirm
        open={Boolean(deleteId)}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void confirmDelete()}
      />
      <ScheduleModal
        open={scheduleOpen}
        text={text}
        onText={setText}
        onClose={() => setScheduleOpen(false)}
        onSchedule={async (iso) => {
          if (!selected) return;
          await api.scheduleMessage(user.id, selected.id, text.trim(), iso);
          setText("");
          setToast("Message scheduled");
          window.setTimeout(() => setToast(""), 2500);
          const list = await api.schedules(user.id);
          setScheduled(list);
        }}
      />
    </AppShell>
  );
}

export default ChatPage;
