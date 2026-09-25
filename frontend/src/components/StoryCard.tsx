import type { Story } from "../types";
import Avatar from "./Avatar";
import { formatStoryTime } from "../utils";

type Props = {
  story: Story;
  seen?: boolean;
  onClick: () => void;
};

function StoryCard({ story, seen, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-wa-hover"
    >
      <div
        className={`rounded-full p-[2px] ${
          seen ? "bg-wa-border" : "bg-gradient-to-tr from-[#ff5270] via-[#ff8c00] to-wa-accent"
        }`}
      >
        <div className="rounded-full bg-wa-panel p-[2px]">
          <Avatar name={story.sender} size={48} />
        </div>
      </div>
      <div className="min-w-0 flex-1 border-b border-wa-border pb-3">
        <p className="truncate text-[16px] text-wa-text">{story.sender}</p>
        <p className="text-[13px] text-wa-muted">{formatStoryTime(story.createdAt)}</p>
      </div>
    </button>
  );
}

export default StoryCard;
