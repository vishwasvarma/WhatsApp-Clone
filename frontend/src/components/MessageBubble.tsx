import {
  MdDoneAll,
  MdAccessTime,
  MdInsertDriveFile,
  MdDownload,
} from "react-icons/md";
import type { Message } from "../types";
import { formatClock } from "../utils";
import Avatar from "./Avatar";

type Props = {
  message: Message;
  mine: boolean;
  onDelete?: (id: string) => void;
};

function MessageBubble({ message, mine, onDelete }: Props) {
  const attachment = message.attachment;
  const sizeLabel = attachment
    ? attachment.size < 1024 * 1024
      ? `${Math.max(1, Math.round(attachment.size / 1024))} KB`
      : `${(attachment.size / (1024 * 1024)).toFixed(1)} MB`
    : "";

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        onContextMenu={(e) => {
          if (!onDelete) return;
          e.preventDefault();
          onDelete(message.id);
        }}
        onDoubleClick={() => onDelete?.(message.id)}
        className={`${
          mine ? "wa-bubble-out bg-wa-out" : "wa-bubble-in bg-wa-inn"
        } max-w-[65%] rounded-lg px-2 pb-1 pt-1.5 text-left text-[14.2px] leading-[19px] text-wa-text shadow-bubble`}
      >
        {message.sharedContact ? (
          <span className="flex min-w-52 items-center gap-3 rounded-md bg-black/10 p-2">
            <Avatar name={message.sharedContact.username} size={42} />
            <span className="min-w-0">
              <span className="block text-sm font-medium">
                {message.sharedContact.username}
              </span>
              <span className="block truncate text-xs opacity-70">
                {message.sharedContact.about || "Contact"}
              </span>
            </span>
          </span>
        ) : attachment ? (
          attachment.mimeType.startsWith("image/") ? (
            <a
              href={attachment.url}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="block"
            >
              <img
                src={attachment.url}
                alt={attachment.name}
                className="max-h-80 max-w-full rounded object-contain"
              />
            </a>
          ) : attachment.mimeType.startsWith("video/") ? (
            <span className="block max-w-80">
              <video
                src={attachment.url}
                controls
                preload="metadata"
                className="max-h-80 max-w-full rounded"
              >
                Your browser does not support video playback.
              </video>
            </span>
          ) : (
            <a
              href={attachment.url}
              download={attachment.name}
              onClick={(event) => event.stopPropagation()}
              className="flex min-w-52 max-w-72 items-center gap-3 rounded-md bg-black/10 p-3 hover:bg-black/20"
            >
              <MdInsertDriveFile size={30} className="shrink-0 text-wa-accent" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {attachment.name}
                </span>
                <span className="block text-xs opacity-70">{sizeLabel}</span>
              </span>
              <MdDownload size={20} className="shrink-0 opacity-70" />
            </a>
          )
        ) : (
          <span className="whitespace-pre-wrap break-words pr-0">
            {message.text}
          </span>
        )}
        <span className="mt-1 flex items-center justify-end gap-1 text-[11px] text-[#ffffff99]">
          {mine && message.scheduled ? <MdAccessTime size={12} /> : null}
          {formatClock(message.time)}
          {mine ? <MdDoneAll size={14} className="text-[#53bdeb]" /> : null}
        </span>
      </div>
    </div>
  );
}

export default MessageBubble;
