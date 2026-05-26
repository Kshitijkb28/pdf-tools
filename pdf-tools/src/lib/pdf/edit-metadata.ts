import { PDFDocument } from "pdf-lib";

export interface PdfMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
}

export async function readMetadata(
  input: Uint8Array | ArrayBuffer
): Promise<PdfMetadata> {
  const pdfDoc = await PDFDocument.load(input);

  return {
    title: pdfDoc.getTitle() ?? "",
    author: pdfDoc.getAuthor() ?? "",
    subject: pdfDoc.getSubject() ?? "",
    keywords: pdfDoc.getKeywords() ?? "",
    creator: pdfDoc.getCreator() ?? "",
    producer: pdfDoc.getProducer() ?? "",
  };
}

export async function writeMetadata(
  input: Uint8Array | ArrayBuffer,
  metadata: PdfMetadata
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(input);

  pdfDoc.setTitle(metadata.title);
  pdfDoc.setAuthor(metadata.author);
  pdfDoc.setSubject(metadata.subject);
  pdfDoc.setKeywords(metadata.keywords.split(",").map((k) => k.trim()));
  pdfDoc.setCreator(metadata.creator);
  pdfDoc.setProducer(metadata.producer);

  return pdfDoc.save();
}
