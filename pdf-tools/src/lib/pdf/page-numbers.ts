import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { PageNumberOptions } from "@/types";

export function toRoman(num: number): string {
  const romanNumerals: [number, string][] = [
    [1000, "m"],
    [900, "cm"],
    [500, "d"],
    [400, "cd"],
    [100, "c"],
    [90, "xc"],
    [50, "l"],
    [40, "xl"],
    [10, "x"],
    [9, "ix"],
    [5, "v"],
    [4, "iv"],
    [1, "i"],
  ];

  let result = "";
  let remaining = num;

  for (const [value, numeral] of romanNumerals) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }

  return result;
}

export function toAlphabetic(num: number): string {
  let result = "";
  let remaining = num;

  while (remaining > 0) {
    remaining--;
    result = String.fromCharCode(97 + (remaining % 26)) + result;
    remaining = Math.floor(remaining / 26);
  }

  return result;
}

function formatPageNumber(pageNum: number, format: PageNumberOptions["format"]): string {
  switch (format) {
    case "numeric":
      return String(pageNum);
    case "roman":
      return toRoman(pageNum);
    case "alphabetic":
      return toAlphabetic(pageNum);
  }
}

export async function addPageNumbers(
  file: File,
  options: PageNumberOptions
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const pageNum = options.startFrom + i;
    const text = formatPageNumber(pageNum, options.format);
    const textWidth = font.widthOfTextAtSize(text, options.fontSize);

    let x: number;
    let y: number;

    switch (options.position) {
      case "bottom-center":
        x = width / 2 - textWidth / 2;
        y = options.margin;
        break;
      case "bottom-left":
        x = options.margin;
        y = options.margin;
        break;
      case "bottom-right":
        x = width - options.margin - textWidth;
        y = options.margin;
        break;
      case "top-center":
        x = width / 2 - textWidth / 2;
        y = height - options.margin - options.fontSize;
        break;
      case "top-left":
        x = options.margin;
        y = height - options.margin - options.fontSize;
        break;
      case "top-right":
        x = width - options.margin - textWidth;
        y = height - options.margin - options.fontSize;
        break;
    }

    page.drawText(text, {
      x,
      y,
      size: options.fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  return pdfDoc.save();
}
