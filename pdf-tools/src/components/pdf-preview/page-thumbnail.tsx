"use client";

import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PageThumbnailProps {
  file: File;
  pageNumber: number;
  width?: number;
  className?: string;
}

export function PageThumbnail({ file, pageNumber, width = 150, className }: PageThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function render() {
      const buffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: buffer }).promise;
      if (cancelled) return;
      const page = await pdf.getPage(pageNumber);
      if (cancelled) return;
      const viewport = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width });
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      await page.render({ canvasContext: ctx, viewport }).promise;
      setLoading(false);
    }
    render();
    return () => { cancelled = true; };
  }, [file, pageNumber, width]);

  return (
    <div className={className}>
      {loading && (
        <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-700" style={{ width, height: width * 1.4 }}>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
        </div>
      )}
      <canvas ref={canvasRef} className={loading ? "hidden" : "rounded shadow-sm"} />
    </div>
  );
}
