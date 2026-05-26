"use client";

import { useCallback, useRef, useState } from "react";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Dropzone } from "@/components/file-upload/dropzone";
import { ProcessingView } from "@/components/tools/processing-view";
import { Button } from "@/components/ui/button";
import { useFileUpload, usePdfProcessing } from "@/hooks/use-file-upload";
import { ACCEPTED_PDF_TYPES } from "@/lib/constants";
import SignaturePad from "signature_pad";
import { PDFDocument } from "pdf-lib";
import { pdfBlob } from "@/lib/utils";

type SignPosition = "bottom-right" | "bottom-left" | "center" | "top-right";

export default function SignPdfPage() {
  const { files, addFiles, clearFiles } = useFileUpload(ACCEPTED_PDF_TYPES);
  const { state, result, startProcessing, updateProgress, completeProcessing, failProcessing, reset } =
    usePdfProcessing();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [hasSig, setHasSig] = useState(false);
  const [pageNum, setPageNum] = useState<"first" | "last">("last");
  const [position, setPosition] = useState<SignPosition>("bottom-right");
  const [pageCount, setPageCount] = useState<number | null>(null);

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      addFiles(fileList);
      try {
        const file = fileList[0];
        if (file) {
          const { PDFDocument: PDFDoc } = await import("pdf-lib");
          const bytes = await file.arrayBuffer();
          const doc = await PDFDoc.load(bytes);
          setPageCount(doc.getPageCount());
        }
      } catch {
        setPageCount(null);
      }
    },
    [addFiles]
  );

  const initPad = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    canvasRef.current = canvas;
    const pad = new SignaturePad(canvas, {
      backgroundColor: "rgb(255, 255, 255)",
      penColor: "rgb(0, 0, 0)",
    });
    pad.addEventListener("endStroke", () => setHasSig(!pad.isEmpty()));
    signaturePadRef.current = pad;
  }, []);

  const clearSignature = useCallback(() => {
    signaturePadRef.current?.clear();
    setHasSig(false);
  }, []);

  const getPositionCoords = (pageWidth: number, pageHeight: number, sigWidth: number, sigHeight: number) => {
    switch (position) {
      case "bottom-right":
        return { x: pageWidth - sigWidth - 50, y: 50 };
      case "bottom-left":
        return { x: 50, y: 50 };
      case "center":
        return { x: (pageWidth - sigWidth) / 2, y: (pageHeight - sigHeight) / 2 };
      case "top-right":
        return { x: pageWidth - sigWidth - 50, y: pageHeight - sigHeight - 50 };
    }
  };

  const handleProcess = useCallback(async () => {
    if (files.length === 0 || !signaturePadRef.current || signaturePadRef.current.isEmpty()) return;
    startProcessing();
    try {
      updateProgress(20, "Preparing signature...");
      const sigDataUrl = signaturePadRef.current.toDataURL("image/png");
      const sigResponse = await fetch(sigDataUrl);
      const sigBytes = new Uint8Array(await sigResponse.arrayBuffer());

      updateProgress(50, "Embedding signature...");
      const pdfBytes = await files[0].file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const sigImage = await pdfDoc.embedPng(sigBytes);
      const targetPageIndex = pageNum === "last" ? pdfDoc.getPageCount() - 1 : 0;
      const page = pdfDoc.getPage(targetPageIndex);
      const { width, height } = page.getSize();
      const sigDims = sigImage.scale(0.3);
      const coords = getPositionCoords(width, height, sigDims.width, sigDims.height);
      page.drawImage(sigImage, {
        x: coords.x,
        y: coords.y,
        width: sigDims.width,
        height: sigDims.height,
      });

      const outputBytes = await pdfDoc.save();
      const blob = pdfBlob(outputBytes);
      completeProcessing(blob);
    } catch (e) {
      failProcessing(e instanceof Error ? e.message : "Failed to sign PDF");
    }
  }, [files, pageNum, position, startProcessing, updateProgress, completeProcessing, failProcessing]);

  const handleReset = useCallback(() => {
    reset();
    clearFiles();
    clearSignature();
    setPageCount(null);
  }, [reset, clearFiles, clearSignature]);

  return (
    <ToolLayout
      title="Sign PDF"
      description="Draw your signature and place it on the PDF"
      gradient="bg-gradient-to-br from-indigo-500 to-violet-500"
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
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
                  Draw your signature
                </label>
                <canvas
                  ref={initPad}
                  width={500}
                  height={200}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600"
                />
                <div className="mt-2 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearSignature}>
                    Clear
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
                    Page
                  </label>
                  <div className="flex gap-2">
                    {([
                      { value: "first" as const, label: "First Page" },
                      { value: "last" as const, label: "Last Page" },
                    ]).map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setPageNum(p.value)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          pageNum === p.value
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
                    Position
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {([
                      { value: "bottom-right" as const, label: "Bottom Right" },
                      { value: "bottom-left" as const, label: "Bottom Left" },
                      { value: "center" as const, label: "Center" },
                      { value: "top-right" as const, label: "Top Right" },
                    ]).map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setPosition(p.value)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          position === p.value
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button size="lg" onClick={handleProcess} disabled={!hasSig}>
                  Sign PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <ProcessingView state={state} result={result} filename="signed.pdf" onReset={handleReset} />
    </ToolLayout>
  );
}
