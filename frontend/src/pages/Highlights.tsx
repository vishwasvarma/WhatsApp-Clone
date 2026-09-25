import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import HighlightCard from "../components/HighlightCard";
import StoryViewer from "../components/StoryViewer";
import { useApp } from "../context/AppContext";
import { api } from "../services/api";
import type { Highlight, Story } from "../types";

function HighlightsPage() {
  const { user } = useApp();
  const [items, setItems] = useState<Highlight[]>([]);
  const [active, setActive] = useState<Story | null>(null);

  useEffect(() => {
    if (!user) return;
    void api.highlights(user.id).then(setItems);
  }, [user]);

  const groups = useMemo(() => {
    const map = new Map<string, Highlight[]>();
    items.forEach((item) => {
      const list = map.get(item.title) || [];
      list.push(item);
      map.set(item.title, list);
    });
    return Array.from(map.entries());
  }, [items]);

  if (!user) return null;

  return (
    <AppShell>
      <aside className="flex w-[400px] shrink-0 flex-col border-r border-wa-border bg-wa-panel">
        <div className="px-4 pb-2 pt-4">
          <h1 className="text-[22px] font-bold text-wa-text">Highlights</h1>
          <p className="mt-1 text-sm text-wa-muted">
            Saved stories stay here even after the original status expires.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 p-4">
          {groups.map(([title, list]) => (
            <HighlightCard
              key={title}
              title={title}
              items={list}
              onOpen={(item) =>
                setActive({
                  id: item.id,
                  sender: item.sender,
                  senderId: item.userId,
                  image: item.image,
                  createdAt: item.createdAt,
                  viewedBy: [],
                })
              }
            />
          ))}
        </div>
        {items.length === 0 ? (
          <p className="px-4 text-sm text-wa-muted">
            Open a story and choose Add to Highlight. Try Travel, College,
            Friends or Memories.
          </p>
        ) : null}
      </aside>
      <main className="flex flex-1 flex-col items-center justify-center bg-wa-bg text-center">
        <p className="text-2xl font-light text-wa-text">Your highlights</p>
        <p className="mt-2 max-w-sm text-sm text-wa-muted">
          Click a circle on the left to reopen a saved story.
        </p>
      </main>
      <StoryViewer
        story={active}
        onClose={() => setActive(null)}
        allowHighlight={false}
      />
    </AppShell>
  );
}

export default HighlightsPage;
