import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdChat,
  MdDonutLarge,
  MdStarOutline,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import { useApp } from "../context/AppContext";
import Avatar from "./Avatar";

const items = [
  { to: "/chat", icon: MdChat, label: "Chats" },
  { to: "/stories", icon: MdDonutLarge, label: "Status" },
  { to: "/highlights", icon: MdStarOutline, label: "Highlights" },
];

function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <nav className="flex w-[67px] flex-col items-center border-r border-wa-border bg-wa-header py-3">
        <img src="/assets/icons/whatsapp.svg" alt="WhatsApp" className="mb-4 h-8 w-8" />
        <div className="flex flex-1 flex-col items-center gap-1">
          {items.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              className={({ isActive }) =>
                `grid h-12 w-12 place-items-center rounded-xl text-[22px] transition ${
                  isActive
                    ? "bg-wa-active text-wa-text"
                    : "text-wa-icon hover:bg-wa-hover"
                }`
              }
            >
              <Icon />
            </NavLink>
          ))}
        </div>
        <div className="flex flex-col items-center gap-1">
          <NavLink
            to="/settings"
            title="Settings"
            className={({ isActive }) =>
              `grid h-12 w-12 place-items-center rounded-xl text-[22px] ${
                isActive ? "bg-wa-active text-wa-text" : "text-wa-icon hover:bg-wa-hover"
              }`
            }
          >
            <MdSettings />
          </NavLink>
          <NavLink to="/profile" title="Profile" className="mt-1">
            <Avatar name={user?.username || "User"} size={36} />
          </NavLink>
          <button
            onClick={() => void handleLogout()}
            title="Log out"
            className="mt-1 grid h-12 w-12 place-items-center rounded-xl text-wa-icon hover:bg-wa-hover"
          >
            <MdLogout />
          </button>
        </div>
      </nav>
      {children}
    </div>
  );
}

export default AppShell;
