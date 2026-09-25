import { useEffect, useState } from "react";
import { MdClose, MdStarOutline } from "react-icons/md";
import type { Story } from "../types";

const TITLES = ["Travel", "College", "Friends", "Memories"];

type Props = {
  story: Story | null;
  onClose: () => void;
  onAddHighlight?: (story: Story, title: string) => Promise<void> | void;
  allowHighlight?: boolean;
  notice?: string;
};

function StoryViewer({
  story,
  onClose,
  onAddHighlight,
  allowHighlight = true,
  notice,
}: Props) {
  const [title, setTitle] = useState("Memories");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    if (!story) return;
    const timer = window.setTimeout(onClose, 6000);
    return () => window.clearTimeout(timer);
  }, [story, onClose]);

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative h-full w-full max-w-xl">
        <div className="absolute left-3 right-3 top-3 z-10 h-1 overflow-hidden rounded bg-white/30">
          <div className="h-full w-full origin-left animate-[progress_6s_linear] bg-white" />
        </div>
        <div className="absolute left-3 right-3 top-6 z-10 flex items-center justify-between text-white">
          <p className="font-medium">{story.sender}</p>
          <button onClick={onClose} className="p-1">
            <MdClose size={24} />
          </button>
        </div>
        <img
          src={story.image}
          alt={story.sender}
          className="h-full w-full object-contain"
        />
        {notice ? (
          <p className="absolute bottom-24 left-0 right-0 text-center text-sm text-white/80">
            {notice}
          </p>
        ) : null}
        {allowHighlight && onAddHighlight ? (
          <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2">
            <div className="flex flex-wrap justify-center gap-2">
              {TITLES.map((item) => (
                <button
                  key={item}
                  onClick={() => setTitle(item)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    title === item ? "bg-white text-black" : "bg-white/20 text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              onClick={async () => {
                await onAddHighlight(story, title);
                setSaved(`Saved to ${title}`);
              }}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black"
            >
              <MdStarOutline />
              Add to Highlight
            </button>
            {saved ? <p className="text-sm text-white">{saved}</p> : null}
          </div>
        ) : null}
      </div>
      <style>{`
        @keyframes progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      `}</style>
    </div>
  );
}

export default StoryViewer;
