import { useState } from "react";
import {
  MdAttachFile,
  MdInsertEmoticon,
  MdMic,
  MdSend,
  MdSchedule,
  MdInsertDriveFile,
  MdPhoto,
  MdCameraAlt,
  MdPerson,
} from "react-icons/md";

const EMOJIS = ["😀", "😂", "❤️", "👍", "🎉", "🔥", "🎂", "👋", "🙏", "😊", "😍", "😎"];

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onSchedule: () => void;
  onTyping: (typing: boolean) => void;
};

function MessageInput({ value, onChange, onSend, onSchedule, onTyping }: Props) {
  const [attach, setAttach] = useState(false);
  const [emoji, setEmoji] = useState(false);

  return (
    <div className="relative bg-wa-header px-2 py-2">
      {attach ? (
        <div className="absolute bottom-16 left-4 z-20 w-56 rounded-xl bg-[#233138] p-3 shadow-2xl">
          <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-wa-text hover:bg-wa-hover">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#7f66ff] text-white">
              <MdInsertDriveFile />
            </span>
            Document
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-wa-text hover:bg-wa-hover">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#007bfc] text-white">
              <MdPhoto />
            </span>
            Photos & videos
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-wa-text hover:bg-wa-hover">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#ff2e74] text-white">
              <MdCameraAlt />
            </span>
            Camera
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-wa-text hover:bg-wa-hover">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#009de2] text-white">
              <MdPerson />
            </span>
            Contact
          </button>
          <button
            onClick={() => {
              setAttach(false);
              onSchedule();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-wa-text hover:bg-wa-hover"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#ffbc38] text-black">
              <MdSchedule />
            </span>
            Schedule message
          </button>
        </div>
      ) : null}
      {emoji ? (
        <div className="absolute bottom-16 left-16 z-20 flex flex-wrap gap-1 rounded-xl bg-[#233138] p-3 shadow-2xl">
          {EMOJIS.map((item) => (
            <button
              key={item}
              onClick={() => onChange(value + item)}
              className="grid h-9 w-9 place-items-center text-lg hover:bg-wa-hover"
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
      <div className="flex items-end gap-1">
        <button
          onClick={() => {
            setEmoji((v) => !v);
            setAttach(false);
          }}
          className="grid h-11 w-11 place-items-center text-wa-icon"
        >
          <MdInsertEmoticon size={26} />
        </button>
        <button
          onClick={() => {
            setAttach((v) => !v);
            setEmoji(false);
          }}
          className="grid h-11 w-11 place-items-center text-wa-icon"
        >
          <MdAttachFile size={24} className="rotate-45" />
        </button>
        <button
          onClick={onSchedule}
          title="Schedule message"
          className="grid h-11 w-11 place-items-center text-wa-icon"
        >
          <MdSchedule size={22} />
        </button>
        <div className="flex flex-1 items-center rounded-lg bg-wa-input px-3">
          <input
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              onTyping(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            onBlur={() => onTyping(false)}
            placeholder="Type a message"
            className="h-11 w-full bg-transparent text-[15px] text-wa-text outline-none placeholder:text-wa-muted"
          />
        </div>
        <button
          onClick={value.trim() ? onSend : undefined}
          className="grid h-11 w-11 place-items-center text-wa-icon"
        >
          {value.trim() ? <MdSend size={22} /> : <MdMic size={24} />}
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
