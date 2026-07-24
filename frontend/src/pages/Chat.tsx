function ChatPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto flex max-w-5xl flex-col rounded-3xl bg-white shadow-lg lg:flex-row">
        <aside className="w-full border-b p-4 lg:w-80 lg:border-b-0 lg:border-r">
          <h2 className="text-xl font-semibold">Chats</h2>
          <div className="mt-4 space-y-2">
            <div className="rounded-lg bg-green-50 p-3">Rahul</div>
            <div className="rounded-lg p-3">Asha</div>
          </div>
        </aside>
        <main className="flex-1 p-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <h3 className="font-semibold">Rahul</h3>
            <p className="mt-2 text-sm text-slate-600">
              Hello! This is a local real-time message view.
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <input
              className="flex-1 rounded-lg border px-3 py-2"
              placeholder="Type a message"
            />
            <button className="rounded-lg bg-green-600 px-4 py-2 text-white">
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ChatPage;
