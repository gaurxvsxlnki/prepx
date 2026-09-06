import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CornerDownLeft,
  FileText,
  Image as ImageIcon,
  Layers,
  Search,
  Target,
} from 'lucide-react';
import { searchStudy, type SearchHit } from '../../lib/search';
import { useUi } from '../../stores/ui';

const GROUPS: Array<{
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

export function SearchBox() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const nav = useNavigate();
  const openGlobal = useUi((s) => s.openSearch);
  const results = searchStudy(q, 4);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const go = (hit: SearchHit) => {
    setOpen(false);
    setQ('');
    nav(hit.href);
  };

  const firstHit = () => {
    for (const g of GROUPS) {
      const f = results[g.key][0];
      if (f) return f;
    }
    return null;
  };

  const showResults = open && q.trim().length >= 2;

  return (
    <div className="dash-search" ref={ref}>
      <Search size={18} className="dash-search-ic" />
      <input
        value={q}
        placeholder="Search chapters, books, questions..."
        aria-label="Search PrepX"
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const f = firstHit();
            if (f) go(f);
          }
          if (e.key === 'Escape') setOpen(false);
        }}
      />
      <button
        type="button"
        className="dash-search-full"
        onClick={openGlobal}
        aria-label="Open full search"
      >
        full search
      </button>

      {showResults && results.count === 0 && (
        <div className="dash-search-pop">
          <p className="px-muted-2 px-fs-sm dash-search-none">
            No matches for “{q}” — try the full search for the whole catalogue.
          </p>
        </div>
      )}

      {showResults && results.count > 0 && (
        <div className="dash-search-pop">
          {GROUPS.map((g) =>
            results[g.key].length === 0 ? null : (
              <div key={g.key} className="dash-search-group">
                <p className="dash-search-pop-label">
                  <g.icon size={13} /> {g.label}
                </p>
                {results[g.key].map((h) => (
                  <button
                    key={`${g.key}-${h.id}`}
                    type="button"
                    className="dash-search-hit"
                    onClick={() => go(h)}
                  >
                    <span className="px-grow">
                      <span className="dash-search-t">{h.title}</span>
                      <span className="dash-search-m">{h.meta}</span>
                    </span>
                    <ArrowRight size={14} className="px-muted-2" />
                  </button>
                ))}
              </div>
            ),
          )}
          <div className="dash-search-foot">
            <span>
              {results.count} results · Enter opens top
            </span>
            <CornerDownLeft size={12} />
          </div>
        </div>
      )}
    </div>
  );
}
