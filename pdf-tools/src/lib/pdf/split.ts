import { PDFDocument } from "pdf-lib";
import type { SplitOptions } from "@/types";

function parseRanges(rangeStr: string, totalPages: number): number[][] {
  return rangeStr.split(",").map((part) => {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      const pages: number[] = [];
      for (let i = start; i <= Math.min(end, totalPages); i++) {
        pages.push(i - 1);
      }
      return pages;
    }
    return [parseInt(trimmed, 10) - 1];
  });
}

export async function splitPdf(file: File, options: SplitOptions): Promise<Uint8Array[]> {
  const buffer = await file.arrayBuffer();
  const sourceDoc = await PDFDocument.load(buffer);
  const totalPages = sourceDoc.getPageCount();
  const results: Uint8Array[] = [];

  if (options.mode === "individual") {
    for (let i = 0; i < totalPages; i++) {
      const newDoc = await PDFDocument.create();
      const [page] = await newDoc.copyPages(sourceDoc, [i]);
      newDoc.addPage(page);
      results.push(await newDoc.save());
    }
  } else if (options.mode === "ranges") {
    const ranges = parseRanges(options.ranges ?? "", totalPages);
    for (const range of ranges) {
      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(sourceDoc, range);
      for (const page of pages) {
        newDoc.addPage(page);
      }
      results.push(await newDoc.save());
    }
  } else if (options.mode === "fixed") {
    const size = options.fixedSize ?? 1;
    for (let i = 0; i < totalPages; i += size) {
      const newDoc = await PDFDocument.create();
      const indices = [];
      for (let j = i; j < Math.min(i + size, totalPages); j++) {
        indices.push(j);
      }
      const pages = await newDoc.copyPages(sourceDoc, indices);
      for (const page of pages) {
        newDoc.addPage(page);
      }
      results.push(await newDoc.save());
    }
  }

  return results;
}

export { parseRanges };
