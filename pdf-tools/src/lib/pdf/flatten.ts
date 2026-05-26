import { PDFDocument } from "pdf-lib";

export async function flattenPdf(
  input: Uint8Array | ArrayBuffer
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(input);

  const form = pdfDoc.getForm();
  form.flatten();

  return pdfDoc.save();
}
