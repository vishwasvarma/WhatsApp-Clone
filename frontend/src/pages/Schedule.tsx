function SchedulePage() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-semibold">Scheduled Messages</h1>
        <p className="mt-2 text-slate-500">
          Queue a message to be delivered later.
        </p>
        <div className="mt-6 rounded-2xl border p-4">
          <p className="font-medium">Happy Birthday 🎉</p>
          <p className="text-sm text-slate-500">
            Scheduled for tomorrow at 12:00 AM
          </p>
        </div>
      </div>
    </div>
  );
}

export default SchedulePage;
