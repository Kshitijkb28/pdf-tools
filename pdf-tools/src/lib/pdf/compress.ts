import { PDFDocument } from "pdf-lib";
import type { CompressOptions } from "@/types";

function removeMetadata(pdfDoc: PDFDocument): void {
  pdfDoc.setTitle("");
  pdfDoc.setAuthor("");
  pdfDoc.setSubject("");
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer("");
  pdfDoc.setCreator("");
}

export async function compressPdf(
  file: File,
  options: CompressOptions
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer);

  if (
    options.quality === "high" ||
    options.quality === "medium" ||
    options.quality === "low"
  ) {
    removeMetadata(pdfDoc);
  }

  return pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
}
