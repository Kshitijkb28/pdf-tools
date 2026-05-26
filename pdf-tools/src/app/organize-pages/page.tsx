"use client";

import { useCallback, useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Dropzone } from "@/components/file-upload/dropzone";
import { FileList } from "@/components/file-upload/file-list";
import { ProcessingView } from "@/components/tools/processing-view";
import { Button } from "@/components/ui/button";
import { useFileUpload, usePdfProcessing } from "@/hooks/use-file-upload";
import { ACCEPTED_PDF_TYPES } from "@/lib/constants";
import { organizePages } from "@/lib/pdf/organize";
import { pdfBlob } from "@/lib/utils";
import { FileText, CheckSquare, Square } from "lucide-react";

export default function OrganizePagesPage() {
  const { files, addFiles, removeFile, reorderFiles, clearFiles } = useFileUpload(ACCEPTED_PDF_TYPES);
  const { state, result, startProcessing, updateProgress, completeProcessing, failProcessing, reset } =
    usePdfProcessing();
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      addFiles(fileList);
      try {
        const file = fileList[0];
        if (file) {
          const { PDFDocument } = await import("pdf-lib");
          const bytes = await file.arrayBuffer();
          const doc = await PDFDocument.load(bytes);
          const count = doc.getPageCount();
          setPageCount(count);
          setSelectedPages(new Set(Array.from({ length: count }, (_, i) => i)));
        }
      } catch {
        setPageCount(null);
      }
    },
    [addFiles]
  );

  const togglePage = useCallback((pageIndex: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageIndex)) {
        next.delete(pageIndex);
      } else {
        next.add(pageIndex);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    if (pageCount) {
      setSelectedPages(new Set(Array.from({ length: pageCount }, (_, i) => i)));
    }
  }, [pageCount]);

  const deselectAll = useCallback(() => {
    setSelectedPages(new Set());
  }, []);

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    startProcessing();
    try {
      updateProgress(40, "Organizing pages...");
      const file = files[0].file;
      const order = Array.from(selectedPages).sort((a, b) => a - b);
      const organized = await organizePages(file, order);
      const blob = pdfBlob(organized);
      completeProcessing(blob);
    } catch (e) {
      failProcessing(e instanceof Error ? e.message : "Failed to organize pages");
    }
  }, [files, selectedPages, startProcessing, updateProgress, completeProcessing, failProcessing]);

  const handleReset = useCallback(() => {
    reset();
    clearFiles();
    setPageCount(null);
    setSelectedPages(new Set());
  }, [reset, clearFiles]);

  return (
    <ToolLayout
      title="Organize Pages"
      description="Reorder, delete, and rearrange PDF pages"
      gradient="bg-gradient-to-br from-yellow-500 to-lime-500"
    >
      {state.status === "idle" && (
        <div className="space-y-6">
          {files.length === 0 ? (
            <Dropzone accept={ACCEPTED_PDF_TYPES} multiple={false} onFiles={handleFiles} />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  File: {files[0].name}
                  {pageCount && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-lime-100 px-2.5 py-0.5 text-xs font-medium text-lime-700 dark:bg-lime-900/30 dark:text-lime-300">
                      <FileText className="h-3 w-3" />
                      {pageCount} pages
                    </span>
                  )}
                </p>
              </div>
              {pageCount && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Pages to keep ({selectedPages.size} of {pageCount})
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAll}
                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/30"
                      >
                        <CheckSquare className="h-3.5 w-3.5" />
                        Select All
                      </button>
                      <button
                        onClick={deselectAll}
                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                      >
                        <Square className="h-3.5 w-3.5" />
                        Deselect All
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
                    {Array.from({ length: pageCount }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => togglePage(i)}
                        className={`flex h-10 w-full items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                          selectedPages.has(i)
                            ? "bg-purple-600 text-white"
                            : "bg-slate-100 text-slate-400 line-through dark:bg-slate-700 dark:text-slate-500"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <FileList files={files} onRemove={removeFile} onReorder={reorderFiles} />
              <p className="text-center text-sm text-slate-500">
                Select pages to keep, then click organize to save.
              </p>
              <div className="flex justify-center">
                <Button size="lg" onClick={handleProcess} disabled={selectedPages.size === 0}>
                  Organize Pages
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <ProcessingView state={state} result={result} filename="organized.pdf" onReset={handleReset} />
    </ToolLayout>
  );
}
