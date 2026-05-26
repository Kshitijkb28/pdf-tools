"use client";

import { useCallback, useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Dropzone } from "@/components/file-upload/dropzone";
import { ProcessingView } from "@/components/tools/processing-view";
import { Button } from "@/components/ui/button";
import { useFileUpload, usePdfProcessing } from "@/hooks/use-file-upload";
import { ACCEPTED_PDF_TYPES } from "@/lib/constants";
import { pdfToImages } from "@/lib/pdf/pdf-to-jpg";
import { Image } from "lucide-react";
import JSZip from "jszip";

type Resolution = 72 | 150 | 300;

export default function PdfToJpgPage() {
  const { files, addFiles, clearFiles } = useFileUpload(ACCEPTED_PDF_TYPES);
  const { state, result, startProcessing, updateProgress, completeProcessing, failProcessing, reset } =
    usePdfProcessing();
  const [quality, setQuality] = useState(0.85);
  const [resolution, setResolution] = useState<Resolution>(150);
  const [pageCount, setPageCount] = useState<number | null>(null);

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      addFiles(fileList);
      try {
        const file = fileList[0];
        if (file) {
          const { PDFDocument } = await import("pdf-lib");
          const bytes = await file.arrayBuffer();
          const doc = await PDFDocument.load(bytes);
          setPageCount(doc.getPageCount());
        }
      } catch {
        setPageCount(null);
      }
    },
    [addFiles]
  );

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    startProcessing();
    try {
      updateProgress(20, "Rendering PDF pages...");
      const images = await pdfToImages(files[0].file, { format: "jpeg", quality });
      updateProgress(70, "Creating zip...");
      const zip = new JSZip();
      images.forEach((blob, i) => {
        zip.file(`page-${i + 1}.jpg`, blob);
      });
      const zipBlob = await zip.generateAsync({ type: "blob" });
      completeProcessing(zipBlob);
    } catch (e) {
      failProcessing(e instanceof Error ? e.message : "Failed to convert PDF to images");
    }
  }, [files, quality, startProcessing, updateProgress, completeProcessing, failProcessing]);

  const handleReset = useCallback(() => {
    reset();
    clearFiles();
    setPageCount(null);
  }, [reset, clearFiles]);

  return (
    <ToolLayout
      title="PDF to JPG"
      description="Convert PDF pages to image files"
      gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
    >
      {state.status === "idle" && (
        <div className="space-y-6">
          {files.length === 0 ? (
            <Dropzone accept={ACCEPTED_PDF_TYPES} multiple={false} onFiles={handleFiles} />
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                File: {files[0].name}
                {pageCount && (
                  <span className="ml-2 text-slate-500">({pageCount} pages)</span>
                )}
              </p>
              <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Quality: {Math.round(quality * 100)}%
                  </label>
                  <input
                    type="range"
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="mt-2 w-full accent-purple-600"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
                    Resolution
                  </label>
                  <div className="flex gap-2">
                    {([72, 150, 300] as const).map((dpi) => (
                      <button
                        key={dpi}
                        onClick={() => setResolution(dpi)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                          resolution === dpi
                            ? "bg-teal-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {dpi} DPI
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {pageCount && (
                <div className="flex items-center justify-center gap-2 rounded-lg bg-teal-50 px-4 py-2.5 dark:bg-teal-950/30">
                  <Image className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                    Will produce {pageCount} images
                  </span>
                </div>
              )}
              <div className="flex justify-center">
                <Button size="lg" onClick={handleProcess}>
                  Convert to Images
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <ProcessingView state={state} result={result} filename="pdf-pages.zip" onReset={handleReset} />
    </ToolLayout>
  );
}
