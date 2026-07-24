import { FiBell, FiMoon, FiSettings, FiToggleRight } from "react-icons/fi";

function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-emerald-600">Settings</p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Preferences
            </h1>
          </div>
          <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
            <FiSettings size={20} />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <FiBell className="text-emerald-600" />
              <div>
                <p className="font-semibold text-slate-900">Notifications</p>
                <p className="text-sm text-slate-500">
                  Receive reminders and message alerts
                </p>
              </div>
            </div>
            <FiToggleRight className="text-2xl text-emerald-600" />
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <FiMoon className="text-emerald-600" />
              <div>
                <p className="font-semibold text-slate-900">Dark mode</p>
                <p className="text-sm text-slate-500">
                  Switch to a darker theme
                </p>
              </div>
            </div>
            <FiToggleRight className="text-2xl text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
