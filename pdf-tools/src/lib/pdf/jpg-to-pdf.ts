import { PDFDocument } from "pdf-lib";

const A4_WIDTH = 595;
const A4_HEIGHT = 842;

async function webpToPng(file: File): Promise<Uint8Array> {
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0);
  const blob = await canvas.convertToBlob({ type: "image/png" });
  return new Uint8Array(await blob.arrayBuffer());
}

function fitToA4(width: number, height: number): { width: number; height: number } {
  const aspectRatio = width / height;
  let pageWidth = width;
  let pageHeight = height;

  if (pageWidth > A4_WIDTH) {
    pageWidth = A4_WIDTH;
    pageHeight = pageWidth / aspectRatio;
  }
  if (pageHeight > A4_HEIGHT) {
    pageHeight = A4_HEIGHT;
    pageWidth = pageHeight * aspectRatio;
  }

  return { width: pageWidth, height: pageHeight };
}

export async function imagesToPdf(files: File[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let image;

    if (file.type === "image/jpeg") {
      image = await pdfDoc.embedJpg(bytes);
    } else if (file.type === "image/png") {
      image = await pdfDoc.embedPng(bytes);
    } else if (file.type === "image/webp") {
      const pngBytes = await webpToPng(file);
      image = await pdfDoc.embedPng(pngBytes);
    } else {
      image = await pdfDoc.embedPng(bytes);
    }

    const { width, height } = fitToA4(image.width, image.height);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  return pdfDoc.save();
}
