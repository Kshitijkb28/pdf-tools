import { PDFDocument } from "pdf-lib";

export async function deletePages(
  input: Uint8Array | ArrayBuffer,
  pageIndicesToDelete: number[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(input);
  const totalPages = pdfDoc.getPageCount();

  if (pageIndicesToDelete.length === 0) {
    throw new Error("No pages selected for deletion");
  }

  if (pageIndicesToDelete.length >= totalPages) {
    throw new Error("Cannot delete all pages from the document");
  }

  // Sort indices in descending order to avoid index shifting
  const sorted = [...pageIndicesToDelete].sort((a, b) => b - a);

  for (const index of sorted) {
    if (index >= 0 && index < totalPages) {
      pdfDoc.removePage(index);
    }
  }

  return pdfDoc.save();
}
