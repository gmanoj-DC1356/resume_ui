import './pdfWorker';
import { getDocument } from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useEffect, useState } from 'react';

interface LoadResult {
  source: Blob;
  doc: PDFDocumentProxy | null;
}

interface PdfDocumentState {
  doc: PDFDocumentProxy | null;
  loading: boolean;
  failed: boolean;
}

// Parses a fetched PDF blob. A result belongs to the blob that produced it, so switching candidates
// shows "loading" straight away instead of briefly showing the previous resume.
export function usePdfDocument(pdf: Blob): PdfDocumentState {
  const [result, setResult] = useState<LoadResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    let task: ReturnType<typeof getDocument> | undefined;

    pdf
      .arrayBuffer()
      .then((buffer) => {
        if (cancelled) return null;
        task = getDocument({ data: new Uint8Array(buffer) });
        return task.promise;
      })
      .then((doc) => {
        if (!cancelled && doc) setResult({ source: pdf, doc });
      })
      .catch(() => {
        // Corrupt or unsupported file: show the safe error state, never the parser's internal message.
        if (!cancelled) setResult({ source: pdf, doc: null });
      });

    return () => {
      cancelled = true;
      // Destroying the task also frees the parsed document and its worker memory.
      void task?.destroy();
    };
  }, [pdf]);

  const current = result?.source === pdf ? result : null;
  return { doc: current?.doc ?? null, loading: current === null, failed: current !== null && current.doc === null };
}
