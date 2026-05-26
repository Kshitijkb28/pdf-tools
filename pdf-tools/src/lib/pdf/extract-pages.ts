import { PDFDocument } from "pdf-lib";

export async function extractPages(
  input: Uint8Array | ArrayBuffer,
  pageIndices: number[]
): Promise<Uint8Array> {
  if (pageIndices.length === 0) {
    throw new Error("No pages selected for extraction");
  }

  const sourceDoc = await PDFDocument.load(input);
  const totalPages = sourceDoc.getPageCount();

  const validIndices = pageIndices.filter((i) => i >= 0 && i < totalPages);

  if (validIndices.length === 0) {
    throw new Error("No valid page indices provided");
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(sourceDoc, validIndices);

  for (const page of copiedPages) {
    newDoc.addPage(page);
  }

  return newDoc.save();
}
