import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdCake,
  MdHelpOutline,
  MdLock,
  MdLogout,
  MdNotifications,
  MdSchedule,
} from "react-icons/md";
import AppShell from "../components/AppShell";
import Avatar from "../components/Avatar";
import { useApp } from "../context/AppContext";
import { api } from "../services/api";
import type { ScheduledMessage } from "../types";

type SettingKey = "notifications" | "privacy" | "birthdays" | "scheduled";
type PreferenceKey =
  | "messageNotifications"
  | "birthdayRemindersEnabled"
  | "invisibleDeleteEnabled";

const settings: {
  id: SettingKey;
  title: string;
  subtitle: string;
  icon: typeof MdLock;
}[] = [
  {
    id: "notifications",
    title: "Notifications",
    subtitle: "Message alerts",
    icon: MdNotifications,
  },
  {
    id: "privacy",
    title: "Privacy",
    subtitle: "Delete-for-everyone",
    icon: MdLock,
  },
  {
    id: "birthdays",
    title: "Birthday reminders",
    subtitle: "Reminders for your contacts",
    icon: MdCake,
  },
  {
    id: "scheduled",
    title: "Scheduled messages",
    subtitle: "Review and schedule messages",
    icon: MdSchedule,
  },
];

function localDateTime(date: Date): string {
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function SettingsPage() {
  const { user, users, notifications, logout, updateProfile } = useApp();
  const navigate = useNavigate();
  const [activeSetting, setActiveSetting] =
    useState<SettingKey>("notifications");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [messageContactId, setMessageContactId] = useState("");
  const [scheduledText, setScheduledText] = useState("");
  const [scheduledAt, setScheduledAt] = useState(() =>
    localDateTime(new Date(Date.now() + 2 * 60 * 1000)),
  );

  useEffect(() => {
    if (!user) return;
    void api.schedules(user.id).then(setScheduledMessages).catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Could not load schedules");
    });
  }, [user?.id]);

  if (!user) return null;

  const savePreference = async (key: PreferenceKey, enabled: boolean) => {
    setSaving(true);
    setError("");
    try {
      await updateProfile({ [key]: enabled });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save setting");
    } finally {
      setSaving(false);
    }
  };

  const toggleMessages = async () => {
    const enabled = user.messageNotifications === false;
    if (enabled) {
      if (!("Notification" in window)) {
        setError("Browser notifications are not supported in this browser.");
        return;
      }
      const permission =
        Notification.permission === "default"
          ? await Notification.requestPermission()
          : Notification.permission;
      if (permission !== "granted") {
        setError("Allow notifications in your browser to enable message alerts.");
        return;
      }
    }
    await savePreference("messageNotifications", enabled);
  };

  const toggleBirthdayReminders = async () => {
    const enabled = user.birthdayRemindersEnabled === false;
    if (
      enabled &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      try {
        await Notification.requestPermission();
      } catch (err) {
        console.error("Could not request browser notification permission", err);
      }
    }
    await savePreference("birthdayRemindersEnabled", enabled);
  };

  const scheduleMessage = async (event: FormEvent) => {
    event.preventDefault();
    const contact = users.find((item) => item.id === messageContactId);
    if (!contact || contact.id === user.id) {
      setError("Choose a contact to receive the message.");
      return;
    }
    if (!scheduledText.trim()) {
      setError("Write a message first.");
      return;
    }
    const sendAt = new Date(scheduledAt);
    if (Number.isNaN(sendAt.getTime()) || sendAt.getTime() <= Date.now()) {
      setError("Choose a future date and time.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const scheduled = await api.scheduleMessage(
        user.id,
        contact.id,
        scheduledText.trim(),
        sendAt.toISOString(),
      );
      setScheduledMessages((current) => [scheduled, ...current]);
      setScheduledText("");
      setSuccess(`Message scheduled for ${contact.username}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not schedule message");
    } finally {
      setSaving(false);
    }
  };

  const cancelScheduledMessage = async (id: string) => {
    setError("");
    setSuccess("");
    try {
      await api.cancelSchedule(id);
      setScheduledMessages((current) =>
        current.map((item) =>
          item.id === id ? { ...item, status: "cancelled" } : item,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel message");
    }
  };

  const active = settings.find((item) => item.id === activeSetting);

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
          {settings.map(({ id, icon: Icon, title, subtitle }) => (
            <button
              key={id}
              type="button"
              aria-current={activeSetting === id ? "page" : undefined}
              onClick={() => {
                setActiveSetting(id);
                setError("");
              }}
              className={`flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-wa-hover ${
                activeSetting === id ? "bg-wa-hover" : ""
              }`}
            >
              <Icon className="text-wa-icon" size={22} />
              <div className="border-b border-wa-border pb-3">
                <p className="text-wa-text">{title}</p>
                <p className="text-sm text-wa-muted">{subtitle}</p>
              </div>
            </button>
          ))}
          <div className="flex items-center gap-4 px-6 py-4">
            <MdHelpOutline className="text-wa-icon" size={22} />
            <div>
              <p className="text-wa-text">Help</p>
              <p className="text-sm text-wa-muted">
                Local WhatsApp clone with extra features
              </p>
            </div>
          </div>
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
      </aside>
      <main className="flex flex-1 flex-col bg-wa-bg px-8 py-10">
        <section className="mx-auto w-full max-w-xl">
          <h2 className="text-2xl font-medium text-wa-text">{active?.title}</h2>
          <p className="mt-2 text-sm text-wa-muted">
            Manage how this account uses {active?.title.toLowerCase()}.
          </p>

          {activeSetting === "notifications" ? (
            <SettingToggle
              title="Message notifications"
              description="Show a browser alert when a new message arrives while this tab is in the background."
              enabled={user.messageNotifications !== false}
              disabled={saving}
              onToggle={() => void toggleMessages()}
            />
          ) : null}

          {activeSetting === "privacy" ? (
            <SettingToggle
              title="Delete messages for everyone"
              description="When enabled, right-click or double-click a message to remove it from both participants' chats."
              enabled={user.invisibleDeleteEnabled !== false}
              disabled={saving}
              onToggle={() =>
                void savePreference(
                  "invisibleDeleteEnabled",
                  user.invisibleDeleteEnabled === false,
                )
              }
            />
          ) : null}

          {activeSetting === "scheduled" ? (
            <>
              <form
                onSubmit={(event) => void scheduleMessage(event)}
                className="mt-8 space-y-4 rounded-lg border border-wa-border bg-wa-panel p-4"
              >
                <div className="flex items-center gap-2">
                  <MdSchedule className="text-wa-accent" size={20} />
                  <h3 className="font-medium text-wa-text">
                    Schedule a message
                  </h3>
                </div>
                <label className="block text-sm text-wa-muted">
                  Contact
                  <select
                    value={messageContactId}
                    onChange={(event) => setMessageContactId(event.target.value)}
                    required
                    className="mt-1 w-full rounded bg-wa-header px-3 py-2 text-wa-text outline-none"
                  >
                    <option value="">Choose a contact</option>
                    {users
                      .filter((contact) => contact.id !== user.id)
                      .map((contact) => (
                        <option key={contact.id} value={contact.id}>
                          {contact.username}
                        </option>
                      ))}
                  </select>
                </label>
                <label className="block text-sm text-wa-muted">
                  Message
                  <textarea
                    value={scheduledText}
                    onChange={(event) => setScheduledText(event.target.value)}
                    rows={3}
                    maxLength={1000}
                    required
                    placeholder="Write a message to send later"
                    className="mt-1 w-full resize-y rounded bg-wa-header px-3 py-2 text-wa-text outline-none"
                  />
                </label>
                <label className="block text-sm text-wa-muted">
                  Send date and time
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    min={localDateTime(new Date(Date.now() + 60 * 1000))}
                    onChange={(event) => setScheduledAt(event.target.value)}
                    required
                    className="mt-1 w-full rounded bg-wa-header px-3 py-2 text-wa-text outline-none"
                  />
                </label>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded bg-wa-accent px-4 py-2 text-sm font-medium text-wa-bg disabled:opacity-60"
                >
                  {saving ? "Scheduling..." : "Schedule message"}
                </button>
              </form>
              {scheduledMessages.length > 0 ? (
                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-medium text-wa-text">
                    Your scheduled messages
                  </h3>
                  {scheduledMessages.map((item) => (
                      <ScheduledMessageCard
                        key={item.id}
                        item={item}
                        onCancel={() => void cancelScheduledMessage(item.id)}
                      />
                    ))}
                </div>
              ) : null}
            </>
          ) : null}

          {activeSetting === "birthdays" ? (
            <>
              <SettingToggle
                title="Receive birthday reminders"
                description="Get an in-app reminder at 3:00 PM the day before a contact's birthday. Browser alerts also appear in the background if permission is allowed."
                enabled={user.birthdayRemindersEnabled !== false}
                disabled={saving}
                onToggle={() => void toggleBirthdayReminders()}
              />
              {user.birthdayRemindersEnabled !== false &&
              notifications.some((item) => item.type === "birthday" && !item.read) ? (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-wa-text">
                    Your reminders
                  </h3>
                  {notifications
                    .filter((item) => item.type === "birthday" && !item.read)
                    .map((item) => (
                      <p key={item.id} className="mt-2 text-sm text-wa-muted">
                        {item.text}
                      </p>
                    ))}
                </div>
              ) : null}
            </>
          ) : null}

          {error ? (
            <p role="alert" className="mt-5 text-sm text-wa-danger">
              {error}
            </p>
          ) : null}
          {success ? (
            <p role="status" className="mt-5 text-sm text-wa-accent">
              {success}
            </p>
          ) : null}
        </section>
      </main>
    </AppShell>
  );
}

function SettingToggle({
  title,
  description,
  enabled,
  disabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mt-8 flex items-start justify-between gap-6 rounded-lg border border-wa-border bg-wa-panel p-4">
      <div>
        <h3 className="font-medium text-wa-text">{title}</h3>
        <p className="mt-2 text-sm leading-5 text-wa-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={title}
        disabled={disabled}
        onClick={onToggle}
        className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-wa-accent" : "bg-wa-border"
        } disabled:cursor-wait disabled:opacity-60`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export default SettingsPage;

function ScheduledMessageCard({
  item,
  onCancel,
}: {
  item: ScheduledMessage;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-wa-border bg-wa-panel p-4">
      <div className="min-w-0">
        <p className="text-sm text-wa-text">
          To {item.receiver}
          <span className="ml-2 capitalize text-wa-muted">· {item.status}</span>
        </p>
        <p className="mt-1 break-words text-sm text-wa-muted">{item.text}</p>
        <p className="mt-2 text-xs text-wa-muted">
          {new Date(item.sendAt).toLocaleString()}
        </p>
      </div>
      {item.status === "pending" ? (
        <button
          type="button"
          onClick={onCancel}
          className="shrink-0 text-sm text-wa-danger hover:underline"
        >
          Cancel
        </button>
      ) : null}
    </div>
  );
}
