import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export interface HeaderFooterOptions {
  headerLeft: string;
  headerCenter: string;
  headerRight: string;
  footerLeft: string;
  footerCenter: string;
  footerRight: string;
  fontSize: number;
  marginX: number;
  marginY: number;
}

export async function addHeaderFooter(
  input: Uint8Array | ArrayBuffer,
  options: HeaderFooterOptions
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(input);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  for (let i = 0; i < totalPages; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const pageNum = i + 1;

    const replacePlaceholders = (text: string): string =>
      text
        .replace(/\{page\}/g, String(pageNum))
        .replace(/\{total\}/g, String(totalPages));

    // Header
    const headerY = height - options.marginY;

    if (options.headerLeft) {
      const text = replacePlaceholders(options.headerLeft);
      page.drawText(text, {
        x: options.marginX,
        y: headerY,
        size: options.fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }

    if (options.headerCenter) {
      const text = replacePlaceholders(options.headerCenter);
      const textWidth = font.widthOfTextAtSize(text, options.fontSize);
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: headerY,
        size: options.fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }

    if (options.headerRight) {
      const text = replacePlaceholders(options.headerRight);
      const textWidth = font.widthOfTextAtSize(text, options.fontSize);
      page.drawText(text, {
        x: width - options.marginX - textWidth,
        y: headerY,
        size: options.fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }

    // Footer
    const footerY = options.marginY;

    if (options.footerLeft) {
      const text = replacePlaceholders(options.footerLeft);
      page.drawText(text, {
        x: options.marginX,
        y: footerY,
        size: options.fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }

    if (options.footerCenter) {
      const text = replacePlaceholders(options.footerCenter);
      const textWidth = font.widthOfTextAtSize(text, options.fontSize);
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: footerY,
        size: options.fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }

    if (options.footerRight) {
      const text = replacePlaceholders(options.footerRight);
      const textWidth = font.widthOfTextAtSize(text, options.fontSize);
      page.drawText(text, {
        x: width - options.marginX - textWidth,
        y: footerY,
        size: options.fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }
  }

  return pdfDoc.save();
}
