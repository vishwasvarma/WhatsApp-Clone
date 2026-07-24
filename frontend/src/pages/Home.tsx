import { Link } from "react-router-dom";
import {
  FiBell,
  FiBookmark,
  FiCalendar,
  FiCamera,
  FiMessageSquare,
  FiSettings,
  FiUser,
} from "react-icons/fi";

const features = [
  {
    to: "/chat",
    label: "Chats",
    icon: FiMessageSquare,
    description: "Real-time chat and conversations",
  },
  {
    to: "/stories",
    label: "Stories",
    icon: FiCamera,
    description: "One-time view stories",
  },
  {
    to: "/highlights",
    label: "Highlights",
    icon: FiBookmark,
    description: "Pinned highlights",
  },
  {
    to: "/schedule",
    label: "Schedule",
    icon: FiCalendar,
    description: "Scheduled messages",
  },
  {
    to: "/profile",
    label: "Profile",
    icon: FiUser,
    description: "Your identity and birthday",
  },
  {
    to: "/settings",
    label: "Settings",
    icon: FiSettings,
    description: "App preferences",
  },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-emerald-600 px-6 py-5 text-white">
          <div>
            <p className="text-sm text-emerald-100">
              Local WhatsApp-inspired app
            </p>
            <h1 className="text-2xl font-semibold">Messaging hub</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/15 p-2">
              <FiBell size={18} />
            </div>
            <Link
              to="/login"
              className="rounded-full border border-white/30 px-3 py-1.5 text-sm"
            >
              Logout
            </Link>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Quick access
              </h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {features.map(({ to, label, icon: Icon, description }) => (
                  <Link
                    key={to}
                    to={to}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-700">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{label}</p>
                        <p className="text-sm text-slate-500">{description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">Today</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-white p-3">4 unread messages</div>
              <div className="rounded-2xl bg-white p-3">2 stories to view</div>
              <div className="rounded-2xl bg-white p-3">
                Birthday reminder tomorrow
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
