function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-2 text-slate-500">Control local app preferences.</p>
        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border p-4">Notifications: Enabled</div>
          <div className="rounded-2xl border p-4">Dark Mode: Off</div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
