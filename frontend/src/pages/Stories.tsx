import { FiCamera, FiClock, FiEye } from "react-icons/fi";

const stories = [
  { title: "Vacation", time: "12m ago", color: "from-orange-400 to-rose-500" },
  { title: "Birthday", time: "1h ago", color: "from-sky-400 to-cyan-500" },
  { title: "Friends", time: "3h ago", color: "from-violet-400 to-fuchsia-500" },
];

function StoriesPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-emerald-600">Stories</p>
            <h1 className="text-2xl font-semibold text-slate-900">
              One-time view stories
            </h1>
          </div>
          <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
            <FiCamera size={20} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {stories.map((story) => (
            <div
              key={story.title}
              className="overflow-hidden rounded-[24px] border border-slate-200"
            >
              <div className={`h-36 bg-gradient-to-br ${story.color}`} />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">{story.title}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
                    {story.time}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <FiEye />
                  <span>View once then disappear</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <FiClock />
            <span>
              Stories automatically expire after their viewing window closes.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoriesPage;
