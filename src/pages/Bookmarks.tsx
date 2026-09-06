import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  BookOpen,
  FileText,
  Image as ImageIcon,
  Layers,
  Target,
  Trash2,
} from 'lucide-react';
import { PageHead } from '../components/common/PageScaffold';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useBookmarks } from '../stores/bookmarks';
import { formatDate } from '../lib/utils';
import { cx } from '../lib/utils';
import type { BookmarkItem } from '../types';

const KIND_META: Record<
  BookmarkItem['kind'],
  { label: string; icon: typeof Bookmark }
> = {
  page: { label: 'Page', icon: Bookmark },
  chapter: { label: 'Chapter', icon: BookOpen },
  question: { label: 'Question', icon: FileText },
  pyq: { label: 'PYQ', icon: Target },
  flashcard: { label: 'Flashcard', icon: Layers },
  diagram: { label: 'Diagram', icon: ImageIcon },
};

type FilterKey = 'all' | BookmarkItem['kind'];
const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'page', label: 'Pages' },
  { key: 'question', label: 'Questions' },
  { key: 'pyq', label: 'PYQs' },
  { key: 'flashcard', label: 'Flashcards' },
  { key: 'diagram', label: 'Diagrams' },
];

export default function Bookmarks() {
  const { items, remove, clearAll } = useBookmarks();
  const [filter, setFilter] = useState<FilterKey>('all');
  const shown = items.filter((b) => filter === 'all' || b.kind === filter);

  const grouped = FILTERS.slice(1)
    .map((f) => ({
      ...f,
      count: items.filter((b) => b.kind === f.key).length,
    }))
    .filter((g) => g.count > 0);

  return (
    <div>
      <PageHead
        icon={<Bookmark size={22} />}
        title="Bookmarks"
        subtitle="Pages, questions, PYQs, cards and diagrams you saved — private to your account."
        action={
          items.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <Trash2 size={14} /> Clear all
            </Button>
          ) : undefined
        }
      />

      <div className="chip-row bm-filters">
        {FILTERS.map((f) => {
          const count = f.key === 'all' ? items.length : items.filter((b) => b.kind === f.key).length;
          return (
            <button
              key={f.key}
              type="button"
              className={cx('chip', filter === f.key && 'is-active')}
              onClick={() => setFilter(f.key)}
              disabled={count === 0 && f.key !== 'all'}
            >
              {f.label}
              <span className="chip-sub">{count}</span>
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Bookmark size={26} />}
            title="Nothing saved yet"
            text="Tap the bookmark icon on any textbook page, question, PYQ, concept card or diagram to keep it here."
            actionLabel="Open a book"
            to="/books"
          />
        </Card>
      ) : shown.length === 0 ? (
        <Card>
          <EmptyState
            compact
            title="Nothing in this filter"
            text="Pick another type above."
          />
        </Card>
      ) : (
        <>
          {grouped.length > 0 && filter === 'all' && (
            <div className="bm-summary">
              {grouped.map((g) => {
                const Icon = KIND_META[g.key as BookmarkItem['kind']].icon;
                return (
                  <button key={g.key} type="button" className="bm-sum" onClick={() => setFilter(g.key)}>
                    <Icon size={15} />
                    <span>
                      <strong>{g.count}</strong> {g.label.toLowerCase()}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="bm-list">
            {shown.map((b) => {
              const meta = KIND_META[b.kind as BookmarkItem['kind']];
              return (
                <Card key={b.id} hover className="bm-item">
                  <span className="bm-ic">
                    <meta.icon size={17} />
                  </span>
                  <div className="px-grow">
                    <div className="bm-top">
                      <Badge tone="neutral">{meta.label}</Badge>
                      <span className="px-muted-2 px-fs-xs">{formatDate(b.addedAt)}</span>
                    </div>
                    <Link to={b.href} className="bm-title">
                      {b.title}
                    </Link>
                    <p className="px-muted-2 px-fs-sm">{b.subtitle}</p>
                  </div>
                  <button
                    type="button"
                    className="bm-remove"
                    aria-label="Remove bookmark"
                    onClick={() => remove(b.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
