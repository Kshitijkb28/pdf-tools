"use client";

import { useCallback, useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Dropzone } from "@/components/file-upload/dropzone";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/use-file-upload";
import { ACCEPTED_PDF_TYPES } from "@/lib/constants";
import { pdfToText } from "@/lib/pdf/pdf-to-text";
import { downloadBlob } from "@/lib/utils";

export default function PdfToTextPage() {
  const { files, addFiles, clearFiles } = useFileUpload(ACCEPTED_PDF_TYPES);
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      addFiles(newFiles);
      const file = Array.from(newFiles)[0];
      if (file) {
        setIsProcessing(true);
        setError("");
        try {
          const buffer = await file.arrayBuffer();
          const text = await pdfToText(new Uint8Array(buffer));
          setExtractedText(text);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to extract text");
        } finally {
          setIsProcessing(false);
        }
      }
    },
    [addFiles]
  );

  const handleDownload = useCallback(() => {
    const blob = new Blob([extractedText], { type: "text/plain" });
    const filename = files[0]?.name.replace(/\.pdf$/i, ".txt") ?? "extracted.txt";
    downloadBlob(blob, filename);
  }, [extractedText, files]);

  const handleReset = useCallback(() => {
    clearFiles();
    setExtractedText("");
    setError("");
  }, [clearFiles]);

  return (
    <ToolLayout
      title="PDF to Text"
      description="Extract all text content from your PDF"
      gradient="bg-gradient-to-br from-emerald-500 to-green-500"
    >
      <div className="space-y-6">
        {files.length === 0 ? (
          <Dropzone accept={ACCEPTED_PDF_TYPES} multiple={false} onFiles={handleFiles} />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                File: {files[0].name}
              </p>
              <button
                onClick={handleReset}
                className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Reset
              </button>
            </div>
            {isProcessing && (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
              </div>
            )}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
            {extractedText && (
              <>
                <textarea
                  value={extractedText}
                  readOnly
                  className="h-96 w-full rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                />
                <div className="flex justify-center">
                  <Button size="lg" onClick={handleDownload}>
                    Download as .txt
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
