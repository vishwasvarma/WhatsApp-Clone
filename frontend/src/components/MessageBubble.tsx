import { MdDoneAll, MdAccessTime } from "react-icons/md";
import type { Message } from "../types";
import { formatClock } from "../utils";

type Props = {
  message: Message;
  mine: boolean;
  onDelete: (id: string) => void;
};

function MessageBubble({ message, mine, onDelete }: Props) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <button
        type="button"
        onContextMenu={(e) => {
          e.preventDefault();
          onDelete(message.id);
        }}
        onDoubleClick={() => onDelete(message.id)}
        className={`${
          mine ? "wa-bubble-out bg-wa-out" : "wa-bubble-in bg-wa-inn"
        } max-w-[65%] rounded-lg px-2 pb-1 pt-1.5 text-left text-[14.2px] leading-[19px] text-wa-text shadow-bubble`}
      >
        <span className="whitespace-pre-wrap break-words pr-12">{message.text}</span>
        <span className="mt-1 flex items-center justify-end gap-1 text-[11px] text-[#ffffff99]">
          {message.scheduled ? <MdAccessTime size={12} /> : null}
          {formatClock(message.time)}
          {mine ? <MdDoneAll size={14} className="text-[#53bdeb]" /> : null}
        </span>
      </button>
    </div>
  );
}

export default MessageBubble;
