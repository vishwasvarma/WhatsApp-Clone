import { FiSearch } from "react-icons/fi";
import { MdFilterList } from "react-icons/md";
import type { User } from "../types";
import Avatar from "./Avatar";
import { formatChatTime } from "../utils";

export type ChatPreview = {
  user: User;
  last?: string;
  time?: number;
  unread: number;
};

type Props = {
  title?: string;
  currentUserName: string;
  search: string;
  onSearch: (value: string) => void;
  filter: "all" | "unread";
  onFilter: (value: "all" | "unread") => void;
  items: ChatPreview[];
  selectedId?: string;
  onSelect: (user: User) => void;
};

function ChatList({
  title = "Chats",
  currentUserName,
  search,
  onSearch,
  filter,
  onFilter,
  items,
  selectedId,
  onSelect,
}: Props) {
  return (
    <aside className="flex w-[400px] shrink-0 flex-col border-r border-wa-border bg-wa-panel">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <h1 className="text-[22px] font-bold text-wa-text">{title}</h1>
        <MdFilterList className="text-wa-icon" size={20} />
      </div>
      <div className="px-3 pb-2">
        <div className="flex items-center gap-3 rounded-lg bg-wa-header px-3 py-1.5 text-wa-muted">
          <FiSearch />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search or start a new chat"
            className="w-full bg-transparent py-1.5 text-sm text-wa-text outline-none placeholder:text-wa-muted"
          />
        </div>
        <div className="mt-3 flex gap-2">
              {(["all", "unread"] as const).map((key) => (
            <button
              key={key}
              onClick={() => onFilter(key)}
              className={`rounded-full px-3 py-1 text-sm ${
                filter === key
                  ? "bg-[#0a332c] text-wa-accent"
                  : "bg-wa-header text-wa-muted"
              }`}
            >
              {key === "all" ? "All" : "Unread"}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <p className="px-5 py-8 text-sm text-wa-muted">
            No contacts yet. Open another browser tab, register a second
            account, then come back here to chat with {currentUserName === "you" ? "them" : "that account"}.
          </p>
        ) : null}
        {items.map((item) => (
          <button
            key={item.user.id}
            onClick={() => onSelect(item.user)}
            className={`flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-wa-hover ${
              selectedId === item.user.id ? "bg-wa-active" : ""
            }`}
          >
            <Avatar name={item.user.username} online={item.user.online} />
            <div className="min-w-0 flex-1 border-b border-wa-border pb-2">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[17px] text-wa-text">
                  {item.user.username}
                </p>
                <span
                  className={`text-[12px] ${
                    item.unread ? "text-wa-accent" : "text-wa-muted"
                  }`}
                >
                  {item.time ? formatChatTime(item.time) : ""}
                </span>
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <p className="truncate text-[14px] text-wa-muted">
                  {item.last || "Click to start chatting"}
                </p>
                {item.unread > 0 ? (
                  <span className="min-w-[20px] rounded-full bg-wa-accent px-1.5 text-center text-[11px] font-semibold text-wa-bg">
                    {item.unread}
                  </span>
                ) : null}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}

export default ChatList;
