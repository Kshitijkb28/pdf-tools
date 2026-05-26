import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { protectPdf } from "@/lib/pdf/protect";
import { unlockPdf } from "@/lib/pdf/unlock";

function createMockFile(bytes: Uint8Array, name = "test.pdf"): File {
  return new File([bytes as BlobPart], name, { type: "application/pdf" });
}

async function createTestPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.addPage([612, 792]);
  return doc.save();
}

describe("protectPdf", () => {
  it("returns a Uint8Array", async () => {
    const pdfBytes = await createTestPdf();
    const file = createMockFile(pdfBytes);

    const result = await protectPdf(file, { userPassword: "secret123" });

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("produces output different from input", async () => {
    const pdfBytes = await createTestPdf();
    const file = createMockFile(pdfBytes);

    const result = await protectPdf(file, { userPassword: "pass" });

    expect(result).not.toEqual(pdfBytes);
  });

  it("includes protection marker", async () => {
    const pdfBytes = await createTestPdf();
    const file = createMockFile(pdfBytes);

    const result = await protectPdf(file, {
      userPassword: "user",
      ownerPassword: "owner",
    });

    const text = new TextDecoder().decode(result.subarray(0, 200));
    expect(text).toContain("PROTECTED:");
  });
});

describe("unlockPdf", () => {
  it("loads a non-encrypted PDF without password", async () => {
    const pdfBytes = await createTestPdf();
    const file = createMockFile(pdfBytes);

    const result = await unlockPdf(file, "");

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns valid PDF bytes", async () => {
    const pdfBytes = await createTestPdf();
    const file = createMockFile(pdfBytes);

    const result = await unlockPdf(file, "");

    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(1);
  });

  it("throws on wrong password for protected PDF", async () => {
    const pdfBytes = await createTestPdf();
    const file = createMockFile(pdfBytes);

    const protectedBytes = await protectPdf(file, {
      userPassword: "correct",
    });
    const protectedFile = createMockFile(protectedBytes);

    await expect(unlockPdf(protectedFile, "wrong")).rejects.toThrow(
      "Invalid password"
    );
  });
});

describe("protect and unlock round-trip", () => {
  it("can unlock a protected PDF with correct password", async () => {
    const pdfBytes = await createTestPdf();
    const file = createMockFile(pdfBytes);

    const protectedBytes = await protectPdf(file, {
      userPassword: "mypass",
      ownerPassword: "ownerpass",
    });
    const protectedFile = createMockFile(protectedBytes);

    const unlockedBytes = await unlockPdf(protectedFile, "mypass");

    const doc = await PDFDocument.load(unlockedBytes);
    expect(doc.getPageCount()).toBe(1);
  });

  it("can unlock with owner password", async () => {
    const pdfBytes = await createTestPdf();
    const file = createMockFile(pdfBytes);

    const protectedBytes = await protectPdf(file, {
      userPassword: "user",
      ownerPassword: "owner",
    });
    const protectedFile = createMockFile(protectedBytes);

    const unlockedBytes = await unlockPdf(protectedFile, "owner");

    const doc = await PDFDocument.load(unlockedBytes);
    expect(doc.getPageCount()).toBe(1);
  });
});
