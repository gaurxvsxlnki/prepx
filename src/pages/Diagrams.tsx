import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  Bookmark,
  BookOpen,
  Check,
  Expand,
  Eye,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
  MousePointerClick,
  Shrink,
  Tag,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { PageHead, SectionHead } from '../components/common/PageScaffold';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SubjectBadge } from '../components/common/SubjectBadge';
import { DIAGRAMS, DEMO_LABEL_NOTE } from '../data/diagrams';
import { BOOKS, subjectOf } from '../data/content';
import { useBookmarks, bookmarkKey } from '../stores/bookmarks';
import { useActivity } from '../stores/activity';
import { useUi } from '../stores/ui';
import type { DiagramItem } from '../types/study';
import type { SubjectCode } from '../types';
import { cx } from '../lib/utils';

type Mode = 'view' | 'practice';

export default function Diagrams() {
  const [selected, setSelected] = useState<DiagramItem | null>(null);
  const [subject, setSubject] = useState<'all' | SubjectCode>('all');

  const shown = DIAGRAMS.filter((d) => subject === 'all' || d.subject === subject);

  const chapterOf = (d: DiagramItem) => {
    for (const b of BOOKS) {
      const c = b.chapters.find((ch) => ch.id === d.chapterId);
      if (c) return { book: b, chapter: c };
    }
    return undefined;
  };

  return (
    <div>
      <PageHead
        icon={<ImageIcon size={22} />}
        title="Important Diagrams"
        subtitle="Real figures straight off the NCERT page — flagged at the exact page they appear on."
        action={<Badge tone="accent">{DIAGRAMS.length} flagged</Badge>}
      />

      <div className="chip-row diagram-subj">
        <FilterChip active={subject === 'all'} onClick={() => setSubject('all')}>
          All subjects
        </FilterChip>
        {(['physics', 'chemistry', 'biology'] as SubjectCode[]).map((s) => (
          <FilterChip key={s} active={subject === s} onClick={() => setSubject(s)}>
            {subjectOf(s).name}
          </FilterChip>
        ))}
      </div>

      {shown.length === 0 ? (
        <Card>
          <p className="px-muted-2">No diagrams in this subject for the demo chapters yet.</p>
        </Card>
      ) : (
        <div className="diagram-grid">
          {shown.map((d) => {
            const meta = chapterOf(d);
            return (
              <Card
                key={d.id}
                hover
                pad={false}
                className="diagram-card"
                onClick={() => setSelected(d)}
              >
                <div className="diagram-img-wrap">
                  <img src={d.imageUrl} alt={d.title} loading="lazy" className="diagram-img" />
                  <span className="diagram-zoom">
                    <ZoomIn size={14} /> Inspect
                  </span>
                </div>
                <div className="diagram-body">
                  <div className="set-top">
                    <SubjectBadge code={d.subject} />
                    <span className="px-muted-2 px-fs-sm">
                      {meta?.book.title} · p. {d.pageNumber}
                    </span>
                  </div>
                  <h3>{d.title}</h3>
                  <p className="px-muted-2 px-fs-sm">{d.caption}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <SectionHead
        title="How to use the viewer"
        sub="Zoom into the real page, toggle region labels, or practise labelling: hide the labels and place each hotspot yourself."
      />

      <DiagramViewer
        item={selected}
        onClose={() => setSelected(null)}
        chapterTitle={selected ? chapterOf(selected)?.chapter.title : undefined}
      />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" className={cx('chip', active && 'is-active')} onClick={onClick}>
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */

function DiagramViewer({
  item,
  onClose,
  chapterTitle,
}: {
  item: DiagramItem | null;
  onClose: () => void;
  chapterTitle?: string;
}) {
  const bookmarks = useBookmarks();
  const activity = useActivity();
  const showToast = useUi((s) => s.showToast);

  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState<Mode>('view');
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [fullscreen, setFullscreen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  /* Record study activity + reset viewer state when a diagram opens. */
  useEffect(() => {
    if (!item) return;
    activity.record({
      kind: 'diagram',
      subject: item.subject,
      bookId: item.bookId,
      chapterId: item.chapterId,
      pageNumber: item.pageNumber,
      label: `Studied diagram · ${item.title.slice(0, 60)}`,
    });
    setZoom(1);
    setMode('view');
    setRevealed(new Set());
  }, [item, activity]);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  if (!item) return null;

  const bookmarkOn = bookmarks.isBookmarked(bookmarkKey('diagram', item.id));
  const readerHref = `/reader/${item.bookId}/chapter/${item.chapterId}/${item.pageNumber}`;

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
    else if (rootRef.current) rootRef.current.requestFullscreen().catch(() => undefined);
  };

  const toggleBookmark = () => {
    bookmarks.toggle({
      kind: 'diagram',
      title: item.title,
      subtitle: `${subjectOf(item.subject).name} · ${chapterTitle ?? ''} · p. ${item.pageNumber}`,
      href: readerHref,
    });
    showToast(bookmarkOn ? 'Bookmark removed' : 'Diagram bookmarked');
  };

  const reveal = (id: string) => {
    setRevealed((s) => {
      const nx = new Set(s);
      nx.add(id);
      return nx;
    });
  };

  const practiceDone = mode === 'practice' && revealed.size === item.labels.length;

  return createPortal(
    <div className="diagram-overlay" ref={rootRef} role="dialog" aria-modal="true">
      <div className="dg-head">
        <div className="dg-title">
          <ImageIcon size={16} />
          <div>
            <strong>{item.title}</strong>
            <span className="px-fs-xs px-muted-2">
              Real NCERT page {item.pageNumber} · {chapterTitle}
            </span>
          </div>
        </div>
        <div className="dg-tools">
          <button
            type="button"
            className={cx('dg-tool', mode === 'practice' && 'is-on')}
            onClick={() => {
              setMode((m) => (m === 'view' ? 'practice' : 'view'));
              setRevealed(new Set());
            }}
            title="Practice labelling"
          >
            <MousePointerClick size={15} />
            {mode === 'practice' ? 'Exit practice' : 'Practice labels'}
          </button>
          <button
            type="button"
            className="dg-tool"
            onClick={toggleFullscreen}
            title="Fullscreen"
          >
            {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            {fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          </button>
          <button type="button" className="dg-tool" onClick={toggleBookmark}>
            <Bookmark size={15} fill={bookmarkOn ? 'currentColor' : 'none'} />
            {bookmarkOn ? 'Saved' : 'Bookmark'}
          </button>
          <button type="button" className="dg-tool" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="dg-zoombar">
        <button type="button" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(2)))}>
          <ZoomOut size={15} /> Zoom out
        </button>
        <span>{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={() => setZoom((z) => Math.min(3, +(z + 0.2).toFixed(2)))}>
          <ZoomIn size={15} /> Zoom in
        </button>
        <button type="button" onClick={() => setZoom(1)}>
          <Shrink size={15} /> Fit
        </button>
      </div>

      <div className="dg-body">
        <div className="dg-canvas-outer">
          <div
            className={cx('dg-canvas', mode === 'practice' && 'is-practice')}
            style={{ transform: `scale(${zoom})` }}
          >
            <img src={item.imageUrl} alt={item.title} draggable={false} />
            {mode === 'view' &&
              item.labels.map((l) => (
                <span key={l.id} className="dg-label" style={{ left: `${l.x}%`, top: `${l.y}%` }}>
                  <Tag size={12} />
                  {l.text}
                </span>
              ))}
            {mode === 'practice' &&
              item.labels.map((l, i) => {
                const shown = revealed.has(l.id);
                return (
                  <button
                    key={l.id}
                    type="button"
                    className={cx('dg-pin', shown && 'is-revealed')}
                    style={{ left: `${l.x}%`, top: `${l.y}%` }}
                    onClick={() => reveal(l.id)}
                    aria-label={`Label ${i + 1}${shown ? `: ${l.text}` : ' (hidden)'}`}
                  >
                    {shown ? (
                      <>
                        <span className="dg-pin-txt">{l.text}</span>
                        <Check size={11} />
                      </>
                    ) : (
                      <span className="dg-pin-dot">{i + 1}</span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      <div className="dg-foot">
        <p className="dg-caption">{item.caption}</p>
        <div className="dg-foot-row">
          <div className="dg-fact">
            <Eye size={13} />
            <span>
              {mode === 'practice'
                ? practiceDone
                  ? `All ${item.labels.length} labels placed — correct!`
                  : `Practice mode — tap the numbered hotspots (${revealed.size}/${item.labels.length})`
                : item.labels.length > 0
                  ? 'Labels shown — switch to Practice to test yourself'
                  : 'Region labels pending QA'}
            </span>
          </div>
          <div className="dg-fact">
            <Expand size={13} />
            <span>{item.examRelevance}</span>
          </div>
        </div>
        {practiceDone && <div className="dg-success">✓ Label placement complete</div>}
        <div className="dg-actions">
          <Button variant="soft" size="sm" to={readerHref} onClick={onClose}>
            <BookOpen size={14} /> Open page {item.pageNumber} in reader
          </Button>
          <span className="px-fs-xs px-muted-2">{DEMO_LABEL_NOTE}</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
