import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import type { WatermarkOptions } from "@/types";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace("#", "");
  const r = parseInt(cleaned.substring(0, 2), 16) / 255;
  const g = parseInt(cleaned.substring(2, 4), 16) / 255;
  const b = parseInt(cleaned.substring(4, 6), 16) / 255;
  return { r, g, b };
}

export async function addWatermark(
  file: File,
  options: WatermarkOptions
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { r, g, b } = hexToRgb(options.color);
  const textWidth = font.widthOfTextAtSize(options.text, options.fontSize);
  const textHeight = options.fontSize;

  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();

    if (options.position === "center") {
      page.drawText(options.text, {
        x: width / 2 - textWidth / 2,
        y: height / 2 - textHeight / 2,
        size: options.fontSize,
        font,
        color: rgb(r, g, b),
        opacity: options.opacity,
        rotate: degrees(options.rotation),
      });
    } else if (options.position === "tiled") {
      const spacingX = textWidth + 100;
      const spacingY = textHeight + 100;

      for (let x = 0; x < width; x += spacingX) {
        for (let y = 0; y < height; y += spacingY) {
          page.drawText(options.text, {
            x,
            y,
            size: options.fontSize,
            font,
            color: rgb(r, g, b),
            opacity: options.opacity,
            rotate: degrees(options.rotation),
          });
        }
      }
    } else {
      const margin = 30;
      let x: number;
      let y: number;

      switch (options.position) {
        case "top-left":
          x = margin;
          y = height - margin - textHeight;
          break;
        case "top-right":
          x = width - margin - textWidth;
          y = height - margin - textHeight;
          break;
        case "bottom-left":
          x = margin;
          y = margin;
          break;
        case "bottom-right":
          x = width - margin - textWidth;
          y = margin;
          break;
      }

      page.drawText(options.text, {
        x,
        y,
        size: options.fontSize,
        font,
        color: rgb(r, g, b),
        opacity: options.opacity,
        rotate: degrees(options.rotation),
      });
    }
  }

  return pdfDoc.save();
}
