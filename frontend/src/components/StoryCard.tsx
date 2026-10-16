import type { Story } from "../types";
import { MdMoreVert } from "react-icons/md";
import Avatar from "./Avatar";
import { formatStoryTime } from "../utils";

type Props = {
  story: Story;
  seen?: boolean;
  onClick: () => void;
  onDelete?: () => void;
};

function StoryCard({ story, seen, onClick, onDelete }: Props) {
  return (
    <div className="flex w-full items-center gap-3 px-4 py-3 hover:bg-wa-hover">
      <div
        className={`rounded-full p-[2px] ${
          seen ? "bg-wa-border" : "bg-gradient-to-tr from-[#ff5270] via-[#ff8c00] to-wa-accent"
        }`}
      >
        <div className="rounded-full bg-wa-panel p-[2px]">
          <Avatar name={story.sender} size={48} />
        </div>
      </div>
      <button onClick={onClick} className="min-w-0 flex-1 border-b border-wa-border pb-3 text-left">
        <p className="truncate text-[16px] text-wa-text">{story.sender}</p>
        <p className="text-[13px] text-wa-muted">{formatStoryTime(story.createdAt)}</p>
      </button>
      {onDelete ? (
        <button
          type="button"
          aria-label="More status options"
          title="More status options"
          onClick={onDelete}
          className="rounded-full p-2 text-wa-muted hover:bg-wa-border hover:text-wa-text"
        >
          <MdMoreVert size={20} />
        </button>
      ) : null}
    </div>
  );
}

export default StoryCard;
