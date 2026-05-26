"use client";

import { useCallback } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Dropzone } from "@/components/file-upload/dropzone";
import { ProcessingView } from "@/components/tools/processing-view";
import { Button } from "@/components/ui/button";
import { useFileUpload, usePdfProcessing } from "@/hooks/use-file-upload";
import { ACCEPTED_PDF_TYPES } from "@/lib/constants";
import { flattenPdf } from "@/lib/pdf/flatten";
import { pdfBlob } from "@/lib/utils";

export default function FlattenPdfPage() {
  const { files, addFiles, clearFiles } = useFileUpload(ACCEPTED_PDF_TYPES);
  const { state, result, startProcessing, updateProgress, completeProcessing, failProcessing, reset } =
    usePdfProcessing();

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    startProcessing();
    try {
      updateProgress(40, "Flattening PDF...");
      const buffer = await files[0].file.arrayBuffer();
      const resultBytes = await flattenPdf(new Uint8Array(buffer));
      const blob = pdfBlob(resultBytes);
      completeProcessing(blob);
    } catch (e) {
      failProcessing(e instanceof Error ? e.message : "Failed to flatten PDF");
    }
  }, [files, startProcessing, updateProgress, completeProcessing, failProcessing]);

  const handleReset = useCallback(() => {
    reset();
    clearFiles();
  }, [reset, clearFiles]);

  return (
    <ToolLayout
      title="Flatten PDF"
      description="Flatten form fields and annotations into the page content"
      gradient="bg-gradient-to-br from-slate-500 to-zinc-600"
    >
      {state.status === "idle" && (
        <div className="space-y-6">
          {files.length === 0 ? (
            <Dropzone accept={ACCEPTED_PDF_TYPES} multiple={false} onFiles={addFiles} />
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                File: {files[0].name}
              </p>
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This will flatten all form fields and annotations, making them part of the page content.
                  The resulting PDF will no longer have editable form fields.
                </p>
              </div>
              <div className="flex justify-center">
                <Button size="lg" onClick={handleProcess}>
                  Flatten PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <ProcessingView state={state} result={result} filename="flattened.pdf" onReset={handleReset} />
    </ToolLayout>
  );
}
