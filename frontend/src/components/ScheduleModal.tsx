import { useEffect, useMemo, useState } from "react";

type Props = {
  open: boolean;
  text: string;
  onText: (value: string) => void;
  onClose: () => void;
  onSchedule: (iso: string) => Promise<void> | void;
};

function toLocalValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function ScheduleModal({ open, text, onText, onClose, onSchedule }: Props) {
  const min = useMemo(() => {
    const next = new Date(Date.now() + 60 * 1000);
    return toLocalValue(next);
  }, [open]);
  const [when, setWhen] = useState(min);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setWhen(min);
      setError("");
    }
  }, [open, min]);

  if (!open) return null;

  const submit = async () => {
    setError("");
    if (!text.trim()) {
      setError("Write a message first.");
      return;
    }
    const sendAt = new Date(when).getTime();
    if (!sendAt || sendAt <= Date.now()) {
      setError("Choose a future date and time.");
      return;
    }
    setSaving(true);
    try {
      await onSchedule(new Date(when).toISOString());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not schedule");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
      <div className="w-[420px] rounded-xl bg-[#3b4a54] p-6 shadow-2xl">
        <p className="text-lg font-medium text-wa-text">Schedule message</p>
        <p className="mt-1 text-sm text-wa-muted">
          The message stays pending until the selected time, then it is sent
          automatically.
        </p>
        <textarea
          value={text}
          onChange={(e) => onText(e.target.value)}
          rows={3}
          className="mt-4 w-full rounded-lg bg-wa-header px-3 py-2 text-sm text-wa-text outline-none"
          placeholder="Write a message in advance"
        />
        <label className="mt-3 block text-sm text-wa-muted">
          Date and time
          <input
            type="datetime-local"
            min={min}
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            className="mt-1 w-full rounded-lg bg-wa-header px-3 py-2 text-wa-text outline-none"
          />
        </label>
        {error ? <p className="mt-2 text-sm text-wa-danger">{error}</p> : null}
        <div className="mt-5 flex justify-end gap-6 text-sm font-medium">
          <button onClick={onClose} className="text-wa-muted">
            Cancel
          </button>
          <button
            onClick={() => void submit()}
            disabled={saving}
            className="text-wa-accent"
          >
            {saving ? "Scheduling..." : "Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScheduleModal;
