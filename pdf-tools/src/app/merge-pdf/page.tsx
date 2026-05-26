"use client";

import { useCallback } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Dropzone } from "@/components/file-upload/dropzone";
import { FileList } from "@/components/file-upload/file-list";
import { ProcessingView } from "@/components/tools/processing-view";
import { Button } from "@/components/ui/button";
import { useFileUpload, usePdfProcessing } from "@/hooks/use-file-upload";
import { ACCEPTED_PDF_TYPES } from "@/lib/constants";
import { mergePdfs } from "@/lib/pdf/merge";
import { pdfBlob } from "@/lib/utils";
import { ArrowDownUp } from "lucide-react";

export default function MergePdfPage() {
  const { files, addFiles, removeFile, reorderFiles, clearFiles, setFiles } = useFileUpload(ACCEPTED_PDF_TYPES);
  const { state, result, startProcessing, updateProgress, completeProcessing, failProcessing, reset } =
    usePdfProcessing();

  const handleProcess = useCallback(async () => {
    if (files.length < 2) return;
    startProcessing();
    try {
      updateProgress(30, "Merging PDFs...");
      const merged = await mergePdfs(files.map((f) => f.file));
      const blob = pdfBlob(merged);
      completeProcessing(blob);
    } catch (e) {
      failProcessing(e instanceof Error ? e.message : "Failed to merge PDFs");
    }
  }, [files, startProcessing, updateProgress, completeProcessing, failProcessing]);

  const handleReset = useCallback(() => {
    reset();
    clearFiles();
  }, [reset, clearFiles]);

  const handleReverse = useCallback(() => {
    setFiles((prev) => [...prev].reverse());
  }, [setFiles]);

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into one document"
      gradient="bg-gradient-to-br from-red-500 to-orange-500"
    >
      {state.status === "idle" && (
        <div className="space-y-6">
          <Dropzone accept={ACCEPTED_PDF_TYPES} multiple onFiles={addFiles} />
          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Merge Order
                </h3>
                {files.length >= 2 && (
                  <button
                    onClick={handleReverse}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
                  >
                    <ArrowDownUp className="h-3.5 w-3.5" />
                    Reverse Order
                  </button>
                )}
              </div>
              <FileList files={files} onRemove={removeFile} onReorder={reorderFiles} showNumbers />
            </div>
          )}
          {files.length >= 2 && (
            <div className="flex justify-center">
              <Button size="lg" onClick={handleProcess}>
                Merge {files.length} PDFs
              </Button>
            </div>
          )}
        </div>
      )}
      <ProcessingView state={state} result={result} filename="merged.pdf" onReset={handleReset} />
    </ToolLayout>
  );
}
