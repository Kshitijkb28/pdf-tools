import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { rotatePdf, rotateAllPages } from "@/lib/pdf/rotate";
import { organizePages } from "@/lib/pdf/organize";

async function createTestPdf(pageCount: number): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    doc.addPage([612, 792]);
  }
  const bytes = await doc.save();
  return new File([bytes.buffer as ArrayBuffer], "test.pdf", { type: "application/pdf" });
}

describe("rotatePdf", () => {
  it("rotates page 0 by 90 degrees", async () => {
    const file = await createTestPdf(3);
    const rotations = new Map([[0, 90]]);
    const result = await rotatePdf(file, rotations);

    const doc = await PDFDocument.load(result);
    const pages = doc.getPages();
    expect(pages[0].getRotation().angle).toBe(90);
    expect(pages[1].getRotation().angle).toBe(0);
    expect(pages[2].getRotation().angle).toBe(0);
  });
});

describe("rotateAllPages", () => {
  it("rotates all pages by 180 degrees", async () => {
    const file = await createTestPdf(3);
    const result = await rotateAllPages(file, 180);

    const doc = await PDFDocument.load(result);
    const pages = doc.getPages();
    for (const page of pages) {
      expect(page.getRotation().angle).toBe(180);
    }
  });
});

describe("organizePages", () => {
  it("reorders pages [2,0,1]", async () => {
    const file = await createTestPdf(3);
    const result = await organizePages(file, [2, 0, 1]);

    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(3);
  });

  it("deletes pages by selecting [0,2]", async () => {
    const file = await createTestPdf(3);
    const result = await organizePages(file, [0, 2]);

    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(2);
  });

  it("duplicates pages [0,0,1]", async () => {
    const file = await createTestPdf(2);
    const result = await organizePages(file, [0, 0, 1]);

    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(3);
  });
});
