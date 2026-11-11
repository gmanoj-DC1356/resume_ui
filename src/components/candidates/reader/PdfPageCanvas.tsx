import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { useEffect, useRef } from 'react';
import { normalizeRotation, resolveScale } from './readerMath';
import type { Size, ZoomMode } from './readerMath';

interface PdfPageCanvasProps {
  doc: PDFDocumentProxy;
  pageNumber: number;
  rotation: number;
  zoom: ZoomMode;
  /** Inner size of the viewer, used by the fit modes. */
  area: Size;
  label: string;
  onScaleChange: (scale: number) => void;
  onError: () => void;
}

// Draws one page. Any change cancels the render in flight so a slow page never paints over a newer one.
export function PdfPageCanvas({
  doc,
  pageNumber,
  rotation,
  zoom,
  area,
  label,
  onScaleChange,
  onError,
}: Readonly<PdfPageCanvasProps>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // The viewer has no size until it is laid out; fit modes need it.
    if (!canvas || area.width === 0 || area.height === 0) return;
    let cancelled = false;
    let renderTask: RenderTask | undefined;

    doc
      .getPage(pageNumber)
      .then((page) => {
        if (cancelled) return;
        const turn = normalizeRotation(page.rotate + rotation);
        const natural = page.getViewport({ scale: 1, rotation: turn });
        const scale = resolveScale(zoom, natural, area);
        const viewport = page.getViewport({ scale, rotation: turn });
        // Draw at device resolution so text stays sharp on high-density screens.
        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * ratio);
        canvas.height = Math.floor(viewport.height * ratio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        onScaleChange(scale);
        renderTask = page.render({
          canvas,
          viewport,
          transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0],
        });
        return renderTask.promise;
      })
      .catch(() => {
        // A cancelled render is expected when the user keeps zooming or turning pages.
        if (!cancelled) onError();
      });

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [doc, pageNumber, rotation, zoom, area, onScaleChange, onError]);

  return <canvas ref={canvasRef} role="img" aria-label={label} className="mx-auto my-4 block bg-white shadow-sm" />;
}
