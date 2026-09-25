type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

function DeleteConfirm({ open, onCancel, onConfirm }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
      <div className="w-[360px] rounded-xl bg-[#3b4a54] p-6 shadow-2xl">
        <p className="text-[15px] text-wa-text">Delete message?</p>
        <p className="mt-3 text-sm text-wa-muted">
          This message will disappear completely for everyone. No “This message
          was deleted” placeholder will be shown.
        </p>
        <div className="mt-6 flex justify-end gap-6 text-sm font-medium">
          <button onClick={onCancel} className="text-wa-accent">
            Cancel
          </button>
          <button onClick={onConfirm} className="text-wa-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirm;
