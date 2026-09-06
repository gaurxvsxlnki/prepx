import { useRef } from 'react';
import { BookX } from 'lucide-react';
import type { BookPage, Chapter } from '../../types';
import { EmptyState } from '../ui/EmptyState';

export function PagePanel({
  page,
  chapter,
  width,
}: {
  page: BookPage;
  chapter: Chapter;
  width?: number;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const asset = page.asset;

  return (
    <div className="page-panel">
      {asset?.url ? (
        <div className="page-stage">
          <img
            ref={imgRef}
            key={asset.url}
            src={asset.url}
            alt={`${chapter.title} — page ${page.printedNumber} (real NCERT page image)`}
            className="page-img"
            style={{ width: width ? `${width}%` : undefined }}
            draggable={false}
            loading="lazy"
            onDragStart={(e) => e.preventDefault()}
          />
          <span className="page-img-note">Real NCERT page · p. {page.printedNumber}</span>
        </div>
      ) : (
        <div className="page-panel-empty">
          <EmptyState
            compact
            icon={<BookX size={26} />}
            title="Page image not imported yet"
            text={`Real page ${page.printedNumber} of “${chapter.title}” arrives in Phase 2. The question panel on the right already works.`}
          />
        </div>
      )}
    </div>
  );
}
