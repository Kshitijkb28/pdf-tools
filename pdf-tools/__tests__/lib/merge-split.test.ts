import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { mergePdfs } from "@/lib/pdf/merge";
import { splitPdf } from "@/lib/pdf/split";

async function createTestPdf(pageCount: number): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    doc.addPage();
  }
  const bytes = await doc.save();
  return new File([bytes], "test.pdf", { type: "application/pdf" });
}

describe("mergePdfs", () => {
  it("merges two PDFs with 2 pages each into 4 pages", async () => {
    const file1 = await createTestPdf(2);
    const file2 = await createTestPdf(2);
    const result = await mergePdfs([file1, file2]);
    const merged = await PDFDocument.load(result);
    expect(merged.getPageCount()).toBe(4);
  });

  it("returns a copy when given a single file", async () => {
    const file = await createTestPdf(3);
    const result = await mergePdfs([file]);
    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(3);
  });

  it("throws when given an empty array", async () => {
    await expect(mergePdfs([])).rejects.toThrow("No files provided for merging");
  });
});

describe("splitPdf", () => {
  it("splits into individual pages", async () => {
    const file = await createTestPdf(3);
    const results = await splitPdf(file, { mode: "individual" });
    expect(results).toHaveLength(3);
    for (const result of results) {
      const doc = await PDFDocument.load(result);
      expect(doc.getPageCount()).toBe(1);
    }
  });

  it("splits by ranges", async () => {
    const file = await createTestPdf(5);
    const results = await splitPdf(file, { mode: "ranges", ranges: "1-2,3-5" });
    expect(results).toHaveLength(2);
    const doc1 = await PDFDocument.load(results[0]);
    const doc2 = await PDFDocument.load(results[1]);
    expect(doc1.getPageCount()).toBe(2);
    expect(doc2.getPageCount()).toBe(3);
  });

  it("splits by fixed size", async () => {
    const file = await createTestPdf(6);
    const results = await splitPdf(file, { mode: "fixed", fixedSize: 2 });
    expect(results).toHaveLength(3);
    for (const result of results) {
      const doc = await PDFDocument.load(result);
      expect(doc.getPageCount()).toBe(2);
    }
  });
});
