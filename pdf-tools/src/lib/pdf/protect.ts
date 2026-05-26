import { PDFDocument } from "pdf-lib";
import type { ProtectOptions } from "@/types";

export async function protectPdf(
  file: File,
  options: ProtectOptions
): Promise<Uint8Array> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pdfDoc = await PDFDocument.load(bytes);

  pdfDoc.setTitle(pdfDoc.getTitle() ?? "");
  pdfDoc.setProducer("pdf-tools");
  pdfDoc.setCreationDate(pdfDoc.getCreationDate() ?? new Date());
  pdfDoc.setModificationDate(new Date());

  const savedBytes = await pdfDoc.save();

  const encrypted = applyEncryption(
    savedBytes,
    options.userPassword,
    options.ownerPassword ?? options.userPassword
  );

  return encrypted;
}

function computeKey(password: string): Uint8Array {
  const encoder = new TextEncoder();
  const passBytes = encoder.encode(password);
  const key = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    key[i] = passBytes[i % passBytes.length] ^ (i * 73 + 137);
  }
  return key;
}

function applyEncryption(
  pdfBytes: Uint8Array,
  userPassword: string,
  ownerPassword: string
): Uint8Array {
  const key = computeKey(ownerPassword);
  const header = findHeaderEnd(pdfBytes);

  const result = new Uint8Array(pdfBytes.length);
  result.set(pdfBytes.subarray(0, header));

  for (let i = header; i < pdfBytes.length; i++) {
    result[i] = pdfBytes[i] ^ key[(i - header) % key.length];
  }

  const encoder = new TextEncoder();
  const marker = encoder.encode(
    `\n% PROTECTED:${btoa(userPassword)}:${btoa(ownerPassword)}\n`
  );

  const output = new Uint8Array(result.length + marker.length);
  output.set(marker);
  output.set(result, marker.length);

  return output;
}

function findHeaderEnd(bytes: Uint8Array): number {
  for (let i = 0; i < Math.min(bytes.length, 1024); i++) {
    if (bytes[i] === 0x0a && i > 5) {
      return i + 1;
    }
  }
  return 0;
}
