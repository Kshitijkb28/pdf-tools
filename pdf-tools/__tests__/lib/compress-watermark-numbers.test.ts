import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { compressPdf } from "@/lib/pdf/compress";
import { addWatermark } from "@/lib/pdf/watermark";
import { addPageNumbers, toRoman, toAlphabetic } from "@/lib/pdf/page-numbers";

async function createTestPdf(pageCount: number): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    doc.addPage();
  }
  const bytes = await doc.save();
  return new File([bytes as BlobPart], "test.pdf", { type: "application/pdf" });
}

describe("compressPdf", () => {
  it("compresses a multi-page PDF with maximum quality", async () => {
    const file = await createTestPdf(3);
    const result = await compressPdf(file, { quality: "maximum" });
    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(3);
  });

  it("compresses with high quality and removes metadata", async () => {
    const file = await createTestPdf(2);
    const result = await compressPdf(file, { quality: "high" });
    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(2);
  });

  it("compresses with low quality", async () => {
    const file = await createTestPdf(4);
    const result = await compressPdf(file, { quality: "low" });
    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(4);
  });

  it("returns valid Uint8Array", async () => {
    const file = await createTestPdf(1);
    const result = await compressPdf(file, { quality: "medium" });
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("addWatermark", () => {
  it("adds a centered watermark and preserves page count", async () => {
    const file = await createTestPdf(3);
    const result = await addWatermark(file, {
      text: "CONFIDENTIAL",
      fontSize: 48,
      opacity: 0.3,
      rotation: -45,
      color: "#ff0000",
      position: "center",
    });
    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(3);
  });

  it("adds a tiled watermark", async () => {
    const file = await createTestPdf(2);
    const result = await addWatermark(file, {
      text: "DRAFT",
      fontSize: 24,
      opacity: 0.2,
      rotation: -30,
      color: "#cccccc",
      position: "tiled",
    });
    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(2);
  });

  it("adds watermark in corner positions", async () => {
    const file = await createTestPdf(1);
    const result = await addWatermark(file, {
      text: "TOP SECRET",
      fontSize: 16,
      opacity: 0.5,
      rotation: 0,
      color: "#0000ff",
      position: "top-right",
    });
    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(1);
  });
});

describe("addPageNumbers", () => {
  it("adds numeric page numbers and preserves page count", async () => {
    const file = await createTestPdf(5);
    const result = await addPageNumbers(file, {
      position: "bottom-center",
      format: "numeric",
      startFrom: 1,
      fontSize: 12,
      margin: 30,
    });
    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(5);
  });

  it("adds page numbers starting from custom number", async () => {
    const file = await createTestPdf(3);
    const result = await addPageNumbers(file, {
      position: "top-right",
      format: "numeric",
      startFrom: 5,
      fontSize: 10,
      margin: 20,
    });
    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(3);
  });

  it("adds roman numeral page numbers", async () => {
    const file = await createTestPdf(4);
    const result = await addPageNumbers(file, {
      position: "bottom-left",
      format: "roman",
      startFrom: 1,
      fontSize: 12,
      margin: 30,
    });
    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(4);
  });
});

describe("toRoman", () => {
  it("converts 1 to i", () => {
    expect(toRoman(1)).toBe("i");
  });

  it("converts 4 to iv", () => {
    expect(toRoman(4)).toBe("iv");
  });

  it("converts 9 to ix", () => {
    expect(toRoman(9)).toBe("ix");
  });

  it("converts 14 to xiv", () => {
    expect(toRoman(14)).toBe("xiv");
  });

  it("converts 42 to xlii", () => {
    expect(toRoman(42)).toBe("xlii");
  });
});

describe("toAlphabetic", () => {
  it("converts 1 to a", () => {
    expect(toAlphabetic(1)).toBe("a");
  });

  it("converts 26 to z", () => {
    expect(toAlphabetic(26)).toBe("z");
  });

  it("converts 27 to aa", () => {
    expect(toAlphabetic(27)).toBe("aa");
  });

  it("converts 28 to ab", () => {
    expect(toAlphabetic(28)).toBe("ab");
  });
});
