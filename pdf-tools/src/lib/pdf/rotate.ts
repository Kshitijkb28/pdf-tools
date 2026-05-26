import { PDFDocument, degrees } from "pdf-lib";

export async function rotatePdf(
  file: File,
  rotations: Map<number, number>
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  for (const [pageIndex, deg] of rotations) {
    if (pageIndex >= 0 && pageIndex < pages.length) {
      const page = pages[pageIndex];
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + deg));
    }
  }

  return pdfDoc.save();
}

export async function rotateAllPages(
  file: File,
  deg: 90 | 180 | 270
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + deg));
  }

  return pdfDoc.save();
}
