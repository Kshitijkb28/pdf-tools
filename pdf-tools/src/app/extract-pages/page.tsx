"use client";

import { useCallback, useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Dropzone } from "@/components/file-upload/dropzone";
import { ProcessingView } from "@/components/tools/processing-view";
import { Button } from "@/components/ui/button";
import { useFileUpload, usePdfProcessing } from "@/hooks/use-file-upload";
import { ACCEPTED_PDF_TYPES } from "@/lib/constants";
import { extractPages } from "@/lib/pdf/extract-pages";
import { pdfBlob } from "@/lib/utils";

export default function ExtractPagesPage() {
  const { files, addFiles, clearFiles } = useFileUpload(ACCEPTED_PDF_TYPES);
  const { state, result, startProcessing, updateProgress, completeProcessing, failProcessing, reset } =
    usePdfProcessing();
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());

  const handleFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      addFiles(newFiles);
      const file = Array.from(newFiles)[0];
      if (file) {
        const { PDFDocument } = await import("pdf-lib");
        const buffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(buffer);
        setPageCount(doc.getPageCount());
        setSelectedPages(new Set());
      }
    },
    [addFiles]
  );

  const togglePage = useCallback((index: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const handleProcess = useCallback(async () => {
    if (files.length === 0 || selectedPages.size === 0) return;
    startProcessing();
    try {
      updateProgress(40, "Extracting pages...");
      const buffer = await files[0].file.arrayBuffer();
      const sorted = Array.from(selectedPages).sort((a, b) => a - b);
      const resultBytes = await extractPages(new Uint8Array(buffer), sorted);
      const blob = pdfBlob(resultBytes);
      completeProcessing(blob);
    } catch (e) {
      failProcessing(e instanceof Error ? e.message : "Failed to extract pages");
    }
  }, [files, selectedPages, startProcessing, updateProgress, completeProcessing, failProcessing]);

  const handleReset = useCallback(() => {
    reset();
    clearFiles();
    setPageCount(0);
    setSelectedPages(new Set());
  }, [reset, clearFiles]);

  return (
    <ToolLayout
      title="Extract Pages"
      description="Extract specific pages into a new PDF"
      gradient="bg-gradient-to-br from-sky-500 to-blue-500"
    >
      {state.status === "idle" && (
        <div className="space-y-6">
          {files.length === 0 ? (
            <Dropzone accept={ACCEPTED_PDF_TYPES} multiple={false} onFiles={handleFiles} />
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                File: {files[0].name} ({pageCount} pages)
              </p>
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <p className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                  Select pages to extract:
                </p>
                <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
                  {Array.from({ length: pageCount }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => togglePage(i)}
                      className={`flex h-10 w-full items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                        selectedPages.has(i)
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
              {selectedPages.size > 0 && (
                <div className="flex justify-center">
                  <Button size="lg" onClick={handleProcess}>
                    Extract {selectedPages.size} Page{selectedPages.size > 1 ? "s" : ""}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <ProcessingView state={state} result={result} filename="extracted-pages.pdf" onReset={handleReset} />
    </ToolLayout>
  );
}
