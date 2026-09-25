import { MdCake, MdClose } from "react-icons/md";
import type { NotificationItem } from "../types";

type Props = {
  items: NotificationItem[];
  onDismiss: (id: string) => void;
};

function BirthdayNotification({ items, onDismiss }: Props) {
  const visible = items.filter((item) => item.type === "birthday" && !item.read);
  if (visible.length === 0) return null;
  return (
    <div className="space-y-2 px-4 pt-3">
      {visible.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 rounded-lg bg-[#182229] px-3 py-2 text-sm text-wa-text shadow"
        >
          <MdCake className="mt-0.5 text-wa-accent" size={18} />
          <div className="flex-1">
            <p className="font-medium">Birthday Reminder</p>
            <p className="text-wa-muted">{item.text}</p>
          </div>
          <button onClick={() => onDismiss(item.id)} className="text-wa-icon">
            <MdClose />
          </button>
        </div>
      ))}
    </div>
  );
}

export default BirthdayNotification;
