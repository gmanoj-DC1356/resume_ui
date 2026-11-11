import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useCallback, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { PdfPageCanvas } from './PdfPageCanvas';
import { ReaderToolbar } from './ReaderToolbar';
import { useElementSize } from './useElementSize';
import { usePdfDocument } from './usePdfDocument';
import { useReaderControls } from './useReaderControls';
import type { ReaderControls } from './useReaderControls';

const VIEWER_HEIGHT_CLASS = 'h-[70vh]';
const LOAD_ERROR = 'The resume could not be displayed. Please try again later.';

interface PdfReaderProps {
  pdf: Blob;
  title: string;
}

function shortcutsFor(controls: ReaderControls): Record<string, () => void> {
  return {
    '+': controls.zoomIn,
    '=': controls.zoomIn,
    '-': controls.zoomOut,
    '0': controls.fitWidth,
    r: controls.rotate,
    ArrowLeft: controls.previousPage,
    PageUp: controls.previousPage,
    ArrowRight: controls.nextPage,
    PageDown: controls.nextPage,
  };
}

function ReaderError() {
  return (
    <p role="alert" className="text-sm text-brand-bad">
      {LOAD_ERROR}
    </p>
  );
}

function LoadedReader({ doc, title }: Readonly<{ doc: PDFDocumentProxy; title: string }>) {
  const controls = useReaderControls(doc.numPages);
  const viewerRef = useRef<HTMLDivElement>(null);
  const area = useElementSize(viewerRef);
  const [renderFailed, setRenderFailed] = useState(false);
  const handleRenderError = useCallback(() => setRenderFailed(true), []);

  const shortcuts = shortcutsFor(controls);
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    // Leave typing in the page box, and the browser's own Ctrl/Cmd shortcuts, alone.
    if (event.target instanceof HTMLInputElement || event.ctrlKey || event.metaKey || event.altKey) return;
    const action = shortcuts[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };

  return (
    <section
      aria-label={title}
      aria-keyshortcuts="+ - 0 R ArrowLeft ArrowRight"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="space-y-2 rounded-md focus-visible:outline-2 focus-visible:outline-brand-accent"
    >
      <ReaderToolbar controls={controls} pageCount={doc.numPages} />
      <div
        ref={viewerRef}
        className={`${VIEWER_HEIGHT_CLASS} overflow-auto rounded-md border border-brand-line bg-brand-bg [scrollbar-gutter:stable]`}
      >
        {renderFailed ? (
          <div className="p-4">
            <ReaderError />
          </div>
        ) : (
          <PdfPageCanvas
            doc={doc}
            pageNumber={controls.page}
            rotation={controls.rotation}
            zoom={controls.zoom}
            area={area}
            label={`${title}, page ${controls.page} of ${doc.numPages}`}
            onScaleChange={controls.setScale}
            onError={handleRenderError}
          />
        )}
      </div>
    </section>
  );
}

// Reads a resume PDF in the app: page navigation, zoom, fit modes and rotation.
export function PdfReader({ pdf, title }: Readonly<PdfReaderProps>) {
  const { doc, loading, failed } = usePdfDocument(pdf);

  if (loading) return <p role="status" className="text-sm text-brand-muted">Loading resume…</p>;
  if (failed || !doc) return <ReaderError />;
  // A new document starts at page 1, fit to width, unrotated.
  return <LoadedReader key={doc.fingerprints[0] ?? title} doc={doc} title={title} />;
}
