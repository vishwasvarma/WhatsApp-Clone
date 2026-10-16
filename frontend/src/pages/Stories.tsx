import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MdAdd } from "react-icons/md";
import AppShell from "../components/AppShell";
import StoryCard from "../components/StoryCard";
import StoryViewer from "../components/StoryViewer";
import Avatar from "../components/Avatar";
import { useApp } from "../context/AppContext";
import { api } from "../services/api";
import socket from "../socket/socket";
import type { Story } from "../types";

function StoriesPage() {
  const { user } = useApp();
  const [stories, setStories] = useState<Story[]>([]);
  const [active, setActive] = useState<Story | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Story | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setStories(await api.stories(user.id));
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const refresh = () => void load();
    const removeDeletedStory = ({ id }: { id: string }) => {
      setStories((current) => current.filter((story) => story.id !== id));
      setActive((current) => (current?.id === id ? null : current));
    };
    socket.on("story-uploaded", refresh);
    socket.on("story-viewed", refresh);
    socket.on("story-deleted", removeDeletedStory);
    return () => {
      socket.off("story-uploaded", refresh);
      socket.off("story-viewed", refresh);
      socket.off("story-deleted", removeDeletedStory);
    };
  }, [load]);

  const mine = useMemo(
    () => stories.filter((item) => item.senderId === user?.id && !item.expired),
    [stories, user],
  );
  const recent = useMemo(
    () =>
      stories.filter(
        (item) =>
          item.senderId !== user?.id && !item.expired && !item.viewedByMe,
      ),
    [stories, user],
  );
  const viewed = useMemo(
    () =>
      stories.filter(
        (item) => item.senderId !== user?.id && !item.expired && item.viewedByMe,
      ),
    [stories, user],
  );

  if (!user) return null;

  const openStory = async (story: Story) => {
    setError("");
    try {
      const viewedStory = await api.viewStory(story.id, user.id);
      setActive({ ...story, ...viewedStory });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Story unavailable");
      setActive(null);
    }
  };

  const upload = async (file: File) => {
    await api.uploadStory(user.id, file);
    await load();
  };

  const deleteStory = async () => {
    if (!deleteCandidate) return;
    setDeleting(true);
    setError("");
    try {
      await api.deleteStory(deleteCandidate.id, user.id);
      setStories((current) =>
        current.filter((story) => story.id !== deleteCandidate.id),
      );
      if (active?.id === deleteCandidate.id) setActive(null);
      setDeleteCandidate(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete status");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppShell>
      <aside className="flex w-[400px] shrink-0 flex-col border-r border-wa-border bg-wa-panel">
        <div className="px-4 pb-2 pt-4">
          <h1 className="text-[22px] font-bold text-wa-text">Status</h1>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-3 px-4 py-3 text-left hover:bg-wa-hover"
        >
          <div className="relative">
            <Avatar name={user.username} size={48} />
            <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-wa-accent text-wa-bg">
              <MdAdd size={14} />
            </span>
          </div>
          <div>
            <p className="text-[16px] text-wa-text">My status</p>
            <p className="text-[13px] text-wa-muted">
              {mine.length ? `${mine.length} update${mine.length > 1 ? "s" : ""}` : "Tap to add a one-time status"}
            </p>
          </div>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
            e.target.value = "";
          }}
        />
        {mine.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onClick={() => void openStory(story)}
            onDelete={() => setDeleteCandidate(story)}
          />
        ))}
        <p className="px-4 py-2 text-xs uppercase tracking-wider text-wa-muted">
          Recent updates
        </p>
        {recent.length === 0 ? (
          <p className="px-4 pb-4 text-sm text-wa-muted">
            No new stories. Ask the other account to upload one.
          </p>
        ) : (
          recent.map((story) => (
            <StoryCard key={story.id} story={story} onClick={() => void openStory(story)} />
          ))
        )}
        {viewed.length > 0 ? (
          <>
            <p className="px-4 py-2 text-xs uppercase tracking-wider text-wa-muted">
              Viewed
            </p>
            {viewed.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                seen
                onClick={() => setError("Story unavailable. You already viewed this once.")}
              />
            ))}
          </>
        ) : null}
      </aside>
      <main className="flex flex-1 flex-col items-center justify-center bg-wa-bg text-center">
        <p className="text-2xl font-light text-wa-text">Status</p>
        <p className="mt-2 max-w-sm text-sm text-wa-muted">
          Upload a photo. The other account can open it only once. After that it
          stays unavailable except in Highlights.
        </p>
        {error ? <p className="mt-4 text-sm text-wa-danger">{error}</p> : null}
      </main>
      <StoryViewer
        story={active}
        onClose={() => setActive(null)}
        allowHighlight={active?.senderId === user.id}
        onAddHighlight={async (story, title) => {
          await api.addHighlight(user.id, story.id, title);
        }}
      />
      {deleteCandidate ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
          role="presentation"
          onClick={() => {
            if (!deleting) setDeleteCandidate(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-status-title"
            className="w-full max-w-sm rounded-lg bg-wa-panel p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="delete-status-title" className="text-lg font-semibold text-wa-text">
              Delete this status?
            </h2>
            <p className="mt-2 text-sm text-wa-muted">
              This status will be removed for everyone.
            </p>
            {error ? (
              <p className="mt-3 text-sm text-wa-danger">{error}</p>
            ) : null}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteCandidate(null)}
                className="rounded px-4 py-2 text-sm text-wa-text hover:bg-wa-hover disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => void deleteStory()}
                className="rounded bg-wa-danger px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

export default StoriesPage;
