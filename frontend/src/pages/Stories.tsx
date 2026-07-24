function StoriesPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-semibold">Stories</h1>
        <p className="mt-2 text-slate-500">
          One-time view stories and disappearing content.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border p-4">Travel Story</div>
          <div className="rounded-2xl border p-4">Birthday Story</div>
        </div>
      </div>
    </div>
  );
}

export default StoriesPage;
