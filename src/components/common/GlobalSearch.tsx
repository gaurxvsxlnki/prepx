import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CornerDownLeft,
  FileText,
  Image as ImageIcon,
  Layers,
  Search,
  Target,
  X,
} from 'lucide-react';
import { searchStudy, type SearchHit } from '../../lib/search';
import { useUi } from '../../stores/ui';

const GROUP_META: Array<{
  key: 'chapters' | 'questions' | 'pyqs' | 'flashcards' | 'diagrams';
  label: string;
  icon: typeof BookOpen;
}> = [
  { key: 'chapters', label: 'Chapters & books', icon: BookOpen },
  { key: 'questions', label: 'Questions', icon: FileText },
  { key: 'pyqs', label: 'PYQs', icon: Target },
  { key: 'flashcards', label: 'Flashcards', icon: Layers },
  { key: 'diagrams', label: 'Diagrams', icon: ImageIcon },
];

export default function GlobalSearch() {
  const open = useUi((s) => s.searchOpen);
  const close = useUi((s) => s.closeSearch);
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const results = searchStudy(q, 5);

  useEffect(() => {
    if (!open) return;
    setQ('');
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  if (!open) return null;

  const firstHit = () => {
    for (const g of GROUP_META) {
      const hit = results[g.key][0];
      if (hit) return hit;
    }
    return null;
  };

  const go = (hit: SearchHit) => {
    close();
    nav(hit.href);
  };

  const flat: Array<{ group: (typeof GROUP_META)[number]; hit: SearchHit }> = [];
  for (const g of GROUP_META) {
    for (const hit of results[g.key]) flat.push({ group: g, hit });
  }

  return createPortal(
    <div className="gs-layer">
      <div className="gs-backdrop" onClick={close} />
      <div className="gs-panel" role="dialog" aria-modal="true" aria-label="Search PrepX">
        <div className="gs-input-row">
          <Search size={19} className="gs-ic" />
          <input
            ref={inputRef}
            value={q}
            placeholder="Search books, chapters, questions, PYQs, diagrams…"
            aria-label="Global search"
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const f = firstHit();
                if (f) go(f);
              }
            }}
          />
          <button type="button" className="gs-close" onClick={close} aria-label="Close search">
            <X size={17} />
          </button>
        </div>

        {q.trim().length < 2 ? (
          <div className="gs-empty">
            <p className="px-muted-2">
              Search across the whole catalogue — try{" "}
              <button type="button" className="btn-link" onClick={() => setQ('photosynthesis')}>
                “photosynthesis”
              </button>{" "}
              or <em>“taxonomy”</em>, <em>“molarity”</em>, <em>“least count”</em>.
            </p>
            <div className="gs-hint-row">
              <span>
                <kbd>↵</kbd> open top result
              </span>
              <span>
                <kbd>esc</kbd> close
              </span>
            </div>
          </div>
        ) : results.count === 0 ? (
          <div className="gs-empty">
            <p className="px-muted-2">No matches for “{q}” in the demo catalogue.</p>
          </div>
        ) : (
          <div className="gs-results">
            {flat.length === 0 ? null : (
              <div className="gs-groups">
                {GROUP_META.map((g) =>
                  results[g.key].length === 0 ? null : (
                    <section key={g.key} className="gs-group">
                      <div className="gs-group-label">
                        <g.icon size={13} /> {g.label}
                      </div>
                      {results[g.key].map((hit) => (
                        <button
                          key={`${g.key}-${hit.id}`}
                          type="button"
                          className="gs-hit"
                          onClick={() => go(hit)}
                        >
                          <span className="gs-hit-main">
                            <span className="gs-hit-title">{hit.title}</span>
                            <span className="gs-hit-meta">
                              {hit.meta}
                              {hit.demo && ' · demo'}
                            </span>
                          </span>
                          <CornerDownLeft size={13} className="gs-hit-enter" />
                        </button>
                      ))}
                    </section>
                  ),
                )}
              </div>
            )}
            <div className="gs-foot">
              <span>
                {results.count} result{results.count === 1 ? '' : 's'} · grouped by content type
              </span>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
