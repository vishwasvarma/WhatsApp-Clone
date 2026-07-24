import { FiBookmark, FiStar } from "react-icons/fi";

const highlights = [
  {
    title: "Vacation",
    subtitle: "7 stories",
    color: "from-amber-400 to-orange-500",
  },
  {
    title: "Friends",
    subtitle: "12 stories",
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "College",
    subtitle: "9 stories",
    color: "from-sky-400 to-indigo-500",
  },
];

function HighlightsPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-emerald-600">Highlights</p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Pinned moments
            </h1>
          </div>
          <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
            <FiBookmark size={20} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {highlights.map((highlight) => (
            <div
              key={highlight.title}
              className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50"
            >
              <div className={`h-28 bg-gradient-to-br ${highlight.color}`} />
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <FiStar className="text-amber-500" />
                  <p className="font-semibold text-slate-900">
                    {highlight.title}
                  </p>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {highlight.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HighlightsPage;
