function HighlightsPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-semibold">Highlights</h1>
        <p className="mt-2 text-slate-500">
          Pinned highlights that stay available after stories expire.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border p-4">Vacation</div>
          <div className="rounded-2xl border p-4">Friends</div>
          <div className="rounded-2xl border p-4">College</div>
        </div>
      </div>
    </div>
  );
}

export default HighlightsPage;
