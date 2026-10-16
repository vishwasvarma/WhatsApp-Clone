import { useRef, useState, type ChangeEvent } from "react";
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
import Avatar from "./Avatar";
import type { User } from "../types";

const EMOJIS = ["😀", "😂", "❤️", "👍", "🎉", "🔥", "🎂", "👋", "🙏", "😊", "😍", "😎"];

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onSchedule: () => void;
  onTyping: (typing: boolean) => void;
  contacts: User[];
  onShareContact: (contact: User) => Promise<void>;
  onFileSelected: (file: File) => Promise<void>;
};

function MessageInput({
  value,
  onChange,
  onSend,
  onSchedule,
  onTyping,
  contacts,
  onShareContact,
  onFileSelected,
}: Props) {
  const [attach, setAttach] = useState(false);
  const [emoji, setEmoji] = useState(false);
  const [contactPickerOpen, setContactPickerOpen] = useState(false);
  const [contactError, setContactError] = useState("");
  const documentInput = useRef<HTMLInputElement | null>(null);
  const mediaInput = useRef<HTMLInputElement | null>(null);
  const cameraInput = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    setAttach(false);
    if (file) await onFileSelected(file);
    event.target.value = "";
  };

  return (
    <div className="relative bg-wa-header px-2 py-2">
      <input
        ref={documentInput}
        type="file"
        className="hidden"
        onChange={(event) => void handleFileChange(event)}
      />
      <input
        ref={mediaInput}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(event) => void handleFileChange(event)}
      />
      <input
        ref={cameraInput}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => void handleFileChange(event)}
      />
      {attach ? (
        <div className="absolute bottom-16 left-4 z-20 w-56 rounded-xl bg-[#233138] p-3 shadow-2xl">
          <button
            type="button"
            onClick={() => documentInput.current?.click()}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-wa-text hover:bg-wa-hover"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#7f66ff] text-white">
              <MdInsertDriveFile />
            </span>
            Document
          </button>
          <button
            type="button"
            onClick={() => mediaInput.current?.click()}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-wa-text hover:bg-wa-hover"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#007bfc] text-white">
              <MdPhoto />
            </span>
            Photos & videos
          </button>
          <button
            type="button"
            onClick={() => cameraInput.current?.click()}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-wa-text hover:bg-wa-hover"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#ff2e74] text-white">
              <MdCameraAlt />
            </span>
            Camera
          </button>
          <button
            type="button"
            onClick={() => {
              setAttach(false);
              setContactError("");
              setContactPickerOpen(true);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-wa-text hover:bg-wa-hover"
          >
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
      {contactPickerOpen ? (
        <div
          className="fixed inset-0 z-40 grid place-items-center bg-black/60 px-4"
          role="presentation"
          onClick={() => setContactPickerOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-contact-title"
            className="max-h-[min(80vh,36rem)] w-full max-w-sm overflow-hidden rounded-xl bg-wa-panel shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-wa-border px-4 py-3">
              <h2 id="share-contact-title" className="font-medium text-wa-text">
                Share a contact
              </h2>
              <p className="mt-1 text-sm text-wa-muted">
                Choose an account to share in this chat.
              </p>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {contacts.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-wa-muted">
                  No other contacts are available.
                </p>
              ) : (
                contacts.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={async () => {
                      setContactError("");
                      try {
                        await onShareContact(contact);
                        setContactPickerOpen(false);
                      } catch (error) {
                        setContactError(
                          error instanceof Error
                            ? error.message
                            : "Could not share contact",
                        );
                      }
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-wa-hover"
                  >
                    <Avatar name={contact.username} size={40} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-wa-text">
                        {contact.username}
                      </span>
                      <span className="block truncate text-xs text-wa-muted">
                        {contact.about || "Hey there! I am using WhatsApp."}
                      </span>
                    </span>
                  </button>
                ))
              )}
            </div>
            {contactError ? (
              <p role="alert" className="px-4 pb-2 text-sm text-wa-danger">
                {contactError}
              </p>
            ) : null}
            <div className="flex justify-end border-t border-wa-border p-3">
              <button
                type="button"
                onClick={() => setContactPickerOpen(false)}
                className="rounded px-4 py-2 text-sm text-wa-muted hover:bg-wa-hover"
              >
                Cancel
              </button>
            </div>
          </section>
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
