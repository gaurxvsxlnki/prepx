import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Minus,
  Plus,
  Scan,
} from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { cx } from '../../lib/utils';

export interface ReaderControlProps {
  pageNumber: number;
  pageCount: number;
  zoom: number;
  bookmarked: boolean;
  canZoomOut: boolean;
  canZoomIn: boolean;
  onPrev(): void;
  onNext(): void;
  onZoomOut(): void;
  onZoomIn(): void;
  onFit(): void;
  onToggleBookmark(): void;
  onToggleFullscreen(): void;
  fullscreen: boolean;
  chapterLabel: string;
}

export function ReaderControls(p: ReaderControlProps) {
  return (
    <div className="reader-controls">
      <div className="rc-left">
        <div className="rc-page-nav">
          <IconButton label="Previous page" size="sm" onClick={p.onPrev} disabled={p.pageNumber <= 1}>
            <ChevronLeft size={18} />
          </IconButton>
          <span className="rc-page-ind">
            Page <strong>{p.pageNumber}</strong> <span className="rc-of">/ {p.pageCount}</span>
          </span>
          <IconButton
            label="Next page"
            size="sm"
            onClick={p.onNext}
            disabled={p.pageNumber >= p.pageCount}
          >
            <ChevronRight size={18} />
          </IconButton>
        </div>
        <span className="rc-chapter px-hide-sm">{p.chapterLabel}</span>
      </div>
      <div className="rc-tools">
        <span className="rc-zoom" aria-label={`Zoom ${Math.round(p.zoom * 100)}%`}>
          <IconButton label="Zoom out" size="sm" onClick={p.onZoomOut} disabled={!p.canZoomOut}>
            <Minus size={16} />
          </IconButton>
          <span className="rc-zoom-val">{Math.round(p.zoom * 100)}%</span>
          <IconButton label="Zoom in" size="sm" onClick={p.onZoomIn} disabled={!p.canZoomIn}>
            <Plus size={16} />
          </IconButton>
        </span>
        <button type="button" className={cx('rc-fit', p.zoom !== 1 && 'is-nonfit')} onClick={p.onFit}>
          <Scan size={15} />
          <span className="px-hide-xs">Fit</span>
        </button>
        <span className="rc-divider" aria-hidden />
        <IconButton
          label={p.bookmarked ? 'Remove bookmark' : 'Bookmark this page'}
          size="sm"
          active={p.bookmarked}
          onClick={p.onToggleBookmark}
        >
          <Bookmark size={17} fill={p.bookmarked ? 'currentColor' : 'none'} />
        </IconButton>
        <IconButton
          label={p.fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          size="sm"
          onClick={p.onToggleFullscreen}
        >
          {p.fullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
        </IconButton>
      </div>
    </div>
  );
}
