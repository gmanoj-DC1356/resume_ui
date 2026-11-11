import { Button } from '@/components/common/Button';
import { MAX_SCALE, MIN_SCALE, scaleToPercent } from './readerMath';
import type { ReaderControls } from './useReaderControls';

interface ReaderToolbarProps {
  controls: ReaderControls;
  pageCount: number;
}

const FIT_LABELS = { 'fit-width': 'Fit width', 'fit-page': 'Fit page' } as const;

function PageNavigation({ controls, pageCount }: Readonly<ReaderToolbarProps>) {
  const { page, goToPage, previousPage, nextPage } = controls;

  const handleInput = (value: string) => {
    const target = Number(value);
    if (Number.isInteger(target) && target >= 1 && target <= pageCount) goToPage(target);
  };

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Page navigation">
      <Button variant="secondary" size="sm" onClick={previousPage} disabled={page <= 1} aria-label="Previous page">
        ‹
      </Button>
      <label className="flex items-center gap-1.5 text-xs text-brand-muted">
        Page
        <input
          type="number"
          min={1}
          max={pageCount}
          value={page}
          onChange={(event) => handleInput(event.target.value)}
          className="w-14 rounded-md border border-brand-line px-2 py-1 text-center text-xs text-brand-text"
        />
        of {pageCount}
      </label>
      <Button variant="secondary" size="sm" onClick={nextPage} disabled={page >= pageCount} aria-label="Next page">
        ›
      </Button>
    </div>
  );
}

function ZoomControls({ controls }: Readonly<Pick<ReaderToolbarProps, 'controls'>>) {
  const { zoom, scale, zoomIn, zoomOut, fitWidth, fitPage } = controls;
  const fitLabel = typeof zoom === 'number' ? null : FIT_LABELS[zoom];

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Zoom">
      <Button variant="secondary" size="sm" onClick={zoomOut} disabled={scale <= MIN_SCALE} aria-label="Zoom out">
        −
      </Button>
      <output aria-label="Zoom level" className="min-w-12 text-center text-xs text-brand-text">
        {scaleToPercent(scale)}%
      </output>
      <Button variant="secondary" size="sm" onClick={zoomIn} disabled={scale >= MAX_SCALE} aria-label="Zoom in">
        +
      </Button>
      <Button
        variant={fitLabel === FIT_LABELS['fit-width'] ? 'secondary' : 'ghost'}
        size="sm"
        onClick={fitWidth}
        aria-pressed={fitLabel === FIT_LABELS['fit-width']}
      >
        {FIT_LABELS['fit-width']}
      </Button>
      <Button
        variant={fitLabel === FIT_LABELS['fit-page'] ? 'secondary' : 'ghost'}
        size="sm"
        onClick={fitPage}
        aria-pressed={fitLabel === FIT_LABELS['fit-page']}
      >
        {FIT_LABELS['fit-page']}
      </Button>
    </div>
  );
}

export function ReaderToolbar({ controls, pageCount }: Readonly<ReaderToolbarProps>) {
  return (
    <div
      role="toolbar"
      aria-label="Resume reader controls"
      className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-brand-line bg-white px-3 py-2"
    >
      <PageNavigation controls={controls} pageCount={pageCount} />
      <ZoomControls controls={controls} />
      <Button variant="secondary" size="sm" onClick={controls.rotate} aria-label="Rotate page clockwise">
        ↻ Rotate
      </Button>
    </div>
  );
}
