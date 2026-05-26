import { PDFDocument } from "pdf-lib";

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  if (files.length === 0) {
    throw new Error("No files provided for merging");
  }

  if (files.length === 1) {
    const buffer = await files[0].arrayBuffer();
    const doc = await PDFDocument.load(buffer);
    return doc.save();
  }

  const mergedDoc = await PDFDocument.create();

  for (const file of files) {
    const buffer = await file.arrayBuffer();
    const sourceDoc = await PDFDocument.load(buffer);
    const pages = await mergedDoc.copyPages(sourceDoc, sourceDoc.getPageIndices());
    for (const page of pages) {
      mergedDoc.addPage(page);
    }
  }

  return mergedDoc.save();
}
