"use client";

import { useCallback, useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Dropzone } from "@/components/file-upload/dropzone";
import { ProcessingView } from "@/components/tools/processing-view";
import { Button } from "@/components/ui/button";
import { useFileUpload, usePdfProcessing } from "@/hooks/use-file-upload";
import { ACCEPTED_PDF_TYPES } from "@/lib/constants";
import { readMetadata, writeMetadata, PdfMetadata } from "@/lib/pdf/edit-metadata";
import { pdfBlob } from "@/lib/utils";

export default function EditMetadataPage() {
  const { files, addFiles, clearFiles } = useFileUpload(ACCEPTED_PDF_TYPES);
  const { state, result, startProcessing, updateProgress, completeProcessing, failProcessing, reset } =
    usePdfProcessing();
  const [metadata, setMetadata] = useState<PdfMetadata>({
    title: "",
    author: "",
    subject: "",
    keywords: "",
    creator: "",
    producer: "",
  });

  const handleFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      addFiles(newFiles);
      const file = Array.from(newFiles)[0];
      if (file) {
        const buffer = await file.arrayBuffer();
        const meta = await readMetadata(new Uint8Array(buffer));
        setMetadata(meta);
      }
    },
    [addFiles]
  );

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    startProcessing();
    try {
      updateProgress(40, "Updating metadata...");
      const buffer = await files[0].file.arrayBuffer();
      const resultBytes = await writeMetadata(new Uint8Array(buffer), metadata);
      const blob = pdfBlob(resultBytes);
      completeProcessing(blob);
    } catch (e) {
      failProcessing(e instanceof Error ? e.message : "Failed to update metadata");
    }
  }, [files, metadata, startProcessing, updateProgress, completeProcessing, failProcessing]);

  const handleReset = useCallback(() => {
    reset();
    clearFiles();
    setMetadata({ title: "", author: "", subject: "", keywords: "", creator: "", producer: "" });
  }, [reset, clearFiles]);

  const updateField = (field: keyof PdfMetadata, value: string) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ToolLayout
      title="Edit Metadata"
      description="View and edit PDF document properties"
      gradient="bg-gradient-to-br from-amber-500 to-orange-500"
    >
      {state.status === "idle" && (
        <div className="space-y-6">
          {files.length === 0 ? (
            <Dropzone accept={ACCEPTED_PDF_TYPES} multiple={false} onFiles={handleFiles} />
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                File: {files[0].name}
              </p>
              <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                {(["title", "author", "subject", "keywords", "creator", "producer"] as const).map(
                  (field) => (
                    <div key={field}>
                      <label className="text-sm font-medium capitalize text-slate-600 dark:text-slate-400">
                        {field}
                      </label>
                      <input
                        type="text"
                        value={metadata[field]}
                        onChange={(e) => updateField(field, e.target.value)}
                        placeholder={`Enter ${field}...`}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                      />
                    </div>
                  )
                )}
              </div>
              <div className="flex justify-center">
                <Button size="lg" onClick={handleProcess}>
                  Save Metadata
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <ProcessingView state={state} result={result} filename="metadata-updated.pdf" onReset={handleReset} />
    </ToolLayout>
  );
}
