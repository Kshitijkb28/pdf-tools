import { PDFDocument } from "pdf-lib";

export async function organizePages(
  file: File,
  newOrder: number[]
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer);
  const destDoc = await PDFDocument.create();

  const copiedPages = await destDoc.copyPages(
    srcDoc,
    newOrder
  );

  for (const page of copiedPages) {
    destDoc.addPage(page);
  }

  return destDoc.save();
}
