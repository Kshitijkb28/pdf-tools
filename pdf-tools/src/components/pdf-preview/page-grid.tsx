"use client";

import { useEffect, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { PageThumbnail } from "./page-thumbnail";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PageGridProps {
  file: File;
  className?: string;
}

export function PageGrid({ file, className }: PageGridProps) {
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    async function load() {
      const buffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: buffer }).promise;
      setPageCount(pdf.numPages);
    }
    load();
  }, [file]);

  if (pageCount === 0) return null;

  return (
    <div className={`grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 ${className || ""}`}>
      {Array.from({ length: pageCount }, (_, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <PageThumbnail file={file} pageNumber={i + 1} width={120} />
          <span className="text-xs text-slate-500">{i + 1}</span>
        </div>
      ))}
    </div>
  );
}
