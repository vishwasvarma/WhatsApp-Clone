import { FiClock, FiSend } from "react-icons/fi";

function SchedulePage() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-emerald-600">Scheduled</p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Pending messages
            </h1>
          </div>
          <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
            <FiClock size={20} />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="font-semibold text-slate-900">Happy Birthday 🎉</p>
              <p className="text-sm text-slate-500">Tomorrow at 12:00 AM</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700">
              <FiSend size={14} />
              Pending
            </div>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="font-semibold text-slate-900">Weekend plan</p>
              <p className="text-sm text-slate-500">Saturday at 7:30 PM</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700">
              <FiClock size={14} />
              Waiting
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchedulePage;
