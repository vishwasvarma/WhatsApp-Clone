import { MdStar } from "react-icons/md";
import type { Highlight } from "../types";

type Props = {
  title: string;
  items: Highlight[];
  onOpen: (item: Highlight) => void;
};

function HighlightCard({ title, items, onOpen }: Props) {
  const cover = items[0];
  return (
    <button onClick={() => cover && onOpen(cover)} className="group text-center">
      <div className="mx-auto grid h-[86px] w-[86px] place-items-center rounded-full border-2 border-wa-muted p-1">
        {cover ? (
          <img
            src={cover.image}
            alt={title}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <MdStar className="text-wa-muted" size={28} />
        )}
      </div>
      <p className="mt-2 max-w-[90px] truncate text-sm text-wa-text">{title}</p>
      <p className="text-xs text-wa-muted">
        {items.length} {items.length === 1 ? "story" : "stories"}
      </p>
    </button>
  );
}

export default HighlightCard;
