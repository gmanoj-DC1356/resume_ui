import { GlobalWorkerOptions } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// pdf.js parses and draws in a worker so large resumes never block the page. The worker file is bundled
// by Vite and served from this app's own origin; nothing is fetched from a CDN.
GlobalWorkerOptions.workerSrc = workerUrl;
