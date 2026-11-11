import { useState } from 'react';
import { clamp, normalizeRotation, ROTATION_STEP, stepScale } from './readerMath';
import type { ZoomMode } from './readerMath';

export interface ReaderControls {
  page: number;
  zoom: ZoomMode;
  rotation: number;
  /** The scale actually drawn, which differs from `zoom` while a fit mode is active. */
  scale: number;
  setScale: (scale: number) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitWidth: () => void;
  fitPage: () => void;
  rotate: () => void;
}

// Reader state in one place so the toolbar, keyboard shortcuts and canvas always agree.
export function useReaderControls(pageCount: number): ReaderControls {
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState<ZoomMode>('fit-width');
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  const goToPage = (target: number) => setPage(clamp(target, 1, pageCount));

  return {
    page,
    zoom,
    rotation,
    scale,
    setScale,
    goToPage,
    nextPage: () => goToPage(page + 1),
    previousPage: () => goToPage(page - 1),
    // Zooming from a fit mode starts from the scale currently on screen.
    zoomIn: () => setZoom(stepScale(scale, 1)),
    zoomOut: () => setZoom(stepScale(scale, -1)),
    fitWidth: () => setZoom('fit-width'),
    fitPage: () => setZoom('fit-page'),
    rotate: () => setRotation((current) => normalizeRotation(current + ROTATION_STEP)),
  };
}
