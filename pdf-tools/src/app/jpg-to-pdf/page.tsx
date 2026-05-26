"use client";

import { useCallback, useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Dropzone } from "@/components/file-upload/dropzone";
import { FileList } from "@/components/file-upload/file-list";
import { ProcessingView } from "@/components/tools/processing-view";
import { Button } from "@/components/ui/button";
import { useFileUpload, usePdfProcessing } from "@/hooks/use-file-upload";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/constants";
import { imagesToPdf } from "@/lib/pdf/jpg-to-pdf";
import { pdfBlob } from "@/lib/utils";

type Orientation = "portrait" | "landscape" | "auto";
type Margin = "none" | "small" | "large";

export default function JpgToPdfPage() {
  const { files, addFiles, removeFile, reorderFiles, clearFiles } = useFileUpload(ACCEPTED_IMAGE_TYPES);
  const { state, result, startProcessing, updateProgress, completeProcessing, failProcessing, reset } =
    usePdfProcessing();
  const [orientation, setOrientation] = useState<Orientation>("auto");
  const [margin, setMargin] = useState<Margin>("small");

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    startProcessing();
    try {
      updateProgress(30, "Converting images to PDF...");
      const pdfBytes = await imagesToPdf(files.map((f) => f.file));
      const blob = pdfBlob(pdfBytes);
      completeProcessing(blob);
    } catch (e) {
      failProcessing(e instanceof Error ? e.message : "Failed to convert images");
    }
  }, [files, startProcessing, updateProgress, completeProcessing, failProcessing]);

  const handleReset = useCallback(() => {
    reset();
    clearFiles();
  }, [reset, clearFiles]);

  return (
    <ToolLayout
      title="JPG to PDF"
      description="Convert images to PDF documents"
      gradient="bg-gradient-to-br from-green-500 to-emerald-500"
    >
      {state.status === "idle" && (
        <div className="space-y-6">
          <Dropzone accept={ACCEPTED_IMAGE_TYPES} multiple onFiles={addFiles} />
          <FileList files={files} onRemove={removeFile} onReorder={reorderFiles} showNumbers />
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
                    Orientation
                  </label>
                  <div className="flex gap-2">
                    {(["auto", "portrait", "landscape"] as const).map((o) => (
                      <button
                        key={o}
                        onClick={() => setOrientation(o)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                          orientation === o
                            ? "bg-green-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
                    Margin
                  </label>
                  <div className="flex gap-2">
                    {([
                      { value: "none" as const, label: "No Margin" },
                      { value: "small" as const, label: "Small" },
                      { value: "large" as const, label: "Large" },
                    ]).map((m) => (
                      <button
                        key={m.value}
                        onClick={() => setMargin(m.value)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          margin === m.value
                            ? "bg-green-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button size="lg" onClick={handleProcess}>
                  Convert {files.length} {files.length === 1 ? "Image" : "Images"} to PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <ProcessingView state={state} result={result} filename="images.pdf" onReset={handleReset} />
    </ToolLayout>
  );
}
