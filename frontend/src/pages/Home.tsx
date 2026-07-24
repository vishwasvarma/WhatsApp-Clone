import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold">WhatsApp Clone</h1>
            <p className="text-slate-500">
              Local real-time messaging with stories, highlights, and schedules.
            </p>
          </div>
          <Link to="/login" className="rounded-lg border px-4 py-2 text-sm">
            Logout
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/chat" className="rounded-2xl border p-5 hover:bg-slate-50">
            Chat
          </Link>
          <Link
            to="/stories"
            className="rounded-2xl border p-5 hover:bg-slate-50"
          >
            Stories
          </Link>
          <Link
            to="/highlights"
            className="rounded-2xl border p-5 hover:bg-slate-50"
          >
            Highlights
          </Link>
          <Link
            to="/schedule"
            className="rounded-2xl border p-5 hover:bg-slate-50"
          >
            Scheduled Messages
          </Link>
          <Link
            to="/profile"
            className="rounded-2xl border p-5 hover:bg-slate-50"
          >
            Profile
          </Link>
          <Link
            to="/settings"
            className="rounded-2xl border p-5 hover:bg-slate-50"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
