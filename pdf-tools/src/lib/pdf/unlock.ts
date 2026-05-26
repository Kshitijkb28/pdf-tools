import { PDFDocument } from "pdf-lib";

export async function unlockPdf(
  file: File,
  password: string
): Promise<Uint8Array> {
  const rawBytes = new Uint8Array(await file.arrayBuffer());

  const { pdfBytes } = stripProtection(rawBytes, password);

  const pdfDoc = await PDFDocument.load(pdfBytes, {
    ignoreEncryption: true,
  });

  return pdfDoc.save();
}

function stripProtection(
  bytes: Uint8Array,
  password: string
): { pdfBytes: Uint8Array; storedUserPassword: string | null } {
  const decoder = new TextDecoder();
  const prefix = decoder.decode(bytes.subarray(0, Math.min(bytes.length, 512)));

  const markerMatch = prefix.match(
    /\n% PROTECTED:([A-Za-z0-9+/=]*):([A-Za-z0-9+/=]*)\n/
  );

  if (!markerMatch) {
    return { pdfBytes: bytes, storedUserPassword: null };
  }

  const storedUserPassword = atob(markerMatch[1]);
  const storedOwnerPassword = atob(markerMatch[2]);

  if (password !== storedUserPassword && password !== storedOwnerPassword) {
    throw new Error("Invalid password");
  }

  const markerEnd =
    prefix.indexOf(markerMatch[0]) +
    new TextEncoder().encode(markerMatch[0]).length;
  const encryptedPdf = bytes.subarray(markerEnd);

  const key = computeKey(storedOwnerPassword);
  const header = findHeaderEnd(encryptedPdf);

  const decrypted = new Uint8Array(encryptedPdf.length);
  decrypted.set(encryptedPdf.subarray(0, header));

  for (let i = header; i < encryptedPdf.length; i++) {
    decrypted[i] = encryptedPdf[i] ^ key[(i - header) % key.length];
  }

  return { pdfBytes: decrypted, storedUserPassword };
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

function findHeaderEnd(bytes: Uint8Array): number {
  for (let i = 0; i < Math.min(bytes.length, 1024); i++) {
    if (bytes[i] === 0x0a && i > 5) {
      return i + 1;
    }
  }
  return 0;
}
