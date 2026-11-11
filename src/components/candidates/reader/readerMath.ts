export const MIN_SCALE = 0.5;
export const MAX_SCALE = 3;
export const SCALE_STEP = 0.25;
export const ROTATION_STEP = 90;
export const FULL_TURN = 360;
export const PERCENT = 100;
// Breathing room kept around the page when it is fitted to the viewer.
export const PAGE_MARGIN_PX = 16;

// 'fit-width' and 'fit-page' follow the viewer size; a number is a fixed scale (1 = 100%).
export type ZoomMode = 'fit-width' | 'fit-page' | number;

export interface Size {
  width: number;
  height: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clampScale(scale: number): number {
  return clamp(scale, MIN_SCALE, MAX_SCALE);
}

// Rounded to the step so repeated zooming lands on tidy values (75%, 100%, 125%) after a fit mode.
export function stepScale(current: number, direction: 1 | -1): number {
  const stepped = Math.round(current / SCALE_STEP) * SCALE_STEP + direction * SCALE_STEP;
  return clampScale(stepped);
}

export function normalizeRotation(rotation: number): number {
  return ((rotation % FULL_TURN) + FULL_TURN) % FULL_TURN;
}

export function scaleToPercent(scale: number): number {
  return Math.round(scale * PERCENT);
}

// page is the page size at scale 1 and already rotated; area is the viewer's inner size.
export function resolveScale(zoom: ZoomMode, page: Size, area: Size): number {
  if (typeof zoom === 'number') return clampScale(zoom);
  const widthScale = (area.width - PAGE_MARGIN_PX * 2) / page.width;
  if (zoom === 'fit-width') return clampScale(widthScale);
  const heightScale = (area.height - PAGE_MARGIN_PX * 2) / page.height;
  return clampScale(Math.min(widthScale, heightScale));
}
