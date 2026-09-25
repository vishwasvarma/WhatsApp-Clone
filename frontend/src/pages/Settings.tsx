import { useNavigate } from "react-router-dom";
import {
  MdNotifications,
  MdLock,
  MdHelpOutline,
  MdLogout,
  MdCake,
} from "react-icons/md";
import AppShell from "../components/AppShell";
import Avatar from "../components/Avatar";
import { useApp } from "../context/AppContext";

function SettingsPage() {
  const { user, notifications, logout } = useApp();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <AppShell>
      <aside className="w-[400px] shrink-0 overflow-y-auto border-r border-wa-border bg-wa-panel">
        <div className="px-4 pb-2 pt-4">
          <h1 className="text-[22px] font-bold text-wa-text">Settings</h1>
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="flex w-full items-center gap-4 px-4 py-4 hover:bg-wa-hover"
        >
          <Avatar name={user.username} size={72} />
          <div className="text-left">
            <p className="text-lg text-wa-text">{user.username}</p>
            <p className="text-sm text-wa-muted">
              {user.about || "Hey there! I am using WhatsApp."}
            </p>
          </div>
        </button>
        <div className="mt-2">
          <Row icon={MdNotifications} title="Notifications" subtitle="Message and birthday alerts" />
          <Row icon={MdLock} title="Privacy" subtitle="Invisible delete removes messages completely" />
          <Row icon={MdCake} title="Birthday reminders" subtitle="Alerts one day before, no auto wishes" />
          <Row icon={MdHelpOutline} title="Help" subtitle="Local WhatsApp clone with extra features" />
          <button
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
            className="flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-wa-hover"
          >
            <MdLogout className="text-wa-danger" size={22} />
            <span className="text-wa-danger">Log out</span>
          </button>
        </div>
        <div className="px-6 py-4">
          <p className="text-xs uppercase tracking-wider text-wa-muted">Reminders</p>
          {notifications.length === 0 ? (
            <p className="mt-2 text-sm text-wa-muted">No reminders yet.</p>
          ) : (
            notifications.map((item) => (
              <p key={item.id} className="mt-2 text-sm text-wa-text">
                {item.text}
              </p>
            ))
          )}
        </div>
      </aside>
      <main className="flex flex-1 flex-col items-center justify-center bg-wa-bg px-8 text-center">
        <p className="text-2xl font-light text-wa-text">Custom features</p>
        <ul className="mt-4 max-w-md space-y-2 text-left text-sm text-wa-muted">
          <li>Invisible Message Delete — right-click or double-click a message.</li>
          <li>Scheduled Messages — clock icon in the chat composer.</li>
          <li>One-Time View Stories — Status tab, viewable once per user.</li>
          <li>Birthday Reminder — set a birthday; contacts are notified the day before.</li>
          <li>Highlights — save a story while viewing it.</li>
        </ul>
      </main>
    </AppShell>
  );
}

function Row({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof MdLock;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <Icon className="text-wa-icon" size={22} />
      <div className="border-b border-wa-border pb-3">
        <p className="text-wa-text">{title}</p>
        <p className="text-sm text-wa-muted">{subtitle}</p>
      </div>
    </div>
  );
}

export default SettingsPage;
