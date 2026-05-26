import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PdfToImagesOptions {
  format?: "png" | "jpeg";
  quality?: number;
  scale?: number;
}

export async function pdfToImages(
  file: File,
  options?: PdfToImagesOptions
): Promise<Blob[]> {
  const { format = "jpeg", quality = 0.85, scale = 2 } = options ?? {};
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  const blobs: Blob[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = new OffscreenCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;

    await page.render({
      canvasContext: ctx as unknown as CanvasRenderingContext2D,
      viewport,
    }).promise;

    const blob = await canvas.convertToBlob({
      type: `image/${format}`,
      quality,
    });
    blobs.push(blob);
  }

  return blobs;
}
