import { FormEvent, useState } from "react";
import AppShell from "../components/AppShell";
import Avatar from "../components/Avatar";
import { useApp } from "../context/AppContext";

function ProfilePage() {
  const { user, updateProfile } = useApp();
  const [birthday, setBirthday] = useState(user?.birthday || "");
  const [about, setAbout] = useState(
    user?.about || "Hey there! I am using WhatsApp.",
  );
  const [saved, setSaved] = useState("");

  if (!user) return null;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateProfile({ birthday, about });
    setSaved("Profile updated");
  };

  return (
    <AppShell>
      <aside className="w-[400px] shrink-0 border-r border-wa-border bg-wa-panel">
        <div className="bg-wa-header px-4 py-5">
          <h1 className="text-lg font-medium text-wa-text">Profile</h1>
        </div>
        <div className="flex flex-col items-center bg-wa-panel py-8">
          <Avatar name={user.username} size={160} />
          <p className="mt-4 text-xl text-wa-text">{user.username}</p>
        </div>
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-5 px-6 py-4">
          <label className="block text-xs text-wa-accent">
            About
            <input
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="mt-2 w-full border-b border-wa-accent bg-transparent py-2 text-wa-text outline-none"
            />
          </label>
          <label className="block text-xs text-wa-accent">
            Birthday
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="mt-2 w-full border-b border-wa-accent bg-transparent py-2 text-wa-text outline-none"
            />
          </label>
          <p className="text-sm text-wa-muted">
            Contacts receive a reminder one day before this date. No automatic
            birthday message is sent.
          </p>
          <button className="rounded bg-wa-accent px-4 py-2 text-sm font-medium text-wa-bg">
            Save
          </button>
          {saved ? <p className="text-sm text-wa-accent">{saved}</p> : null}
        </form>
      </aside>
      <main className="flex flex-1 items-center justify-center bg-wa-bg text-wa-muted">
        Profile
      </main>
    </AppShell>
  );
}

export default ProfilePage;
