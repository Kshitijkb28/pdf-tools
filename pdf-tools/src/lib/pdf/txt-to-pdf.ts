import { PDFDocument, StandardFonts, rgb, PageSizes } from "pdf-lib";

export interface TxtToPdfOptions {
  fontSize: number;
  marginX: number;
  marginY: number;
  pageSize: "A4" | "Letter" | "Legal";
}

const PAGE_SIZE_MAP: Record<string, [number, number]> = {
  A4: PageSizes.A4,
  Letter: PageSizes.Letter,
  Legal: PageSizes.Legal,
};

export async function txtToPdf(
  text: string,
  options: TxtToPdfOptions
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const [pageWidth, pageHeight] = PAGE_SIZE_MAP[options.pageSize] ?? PageSizes.A4;
  const usableWidth = pageWidth - options.marginX * 2;
  const usableHeight = pageHeight - options.marginY * 2;
  const lineHeight = options.fontSize * 1.4;

  const lines = wrapText(text, font, options.fontSize, usableWidth);
  const linesPerPage = Math.floor(usableHeight / lineHeight);

  let lineIndex = 0;

  while (lineIndex < lines.length) {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const startY = pageHeight - options.marginY - options.fontSize;

    for (let i = 0; i < linesPerPage && lineIndex < lines.length; i++) {
      page.drawText(lines[lineIndex], {
        x: options.marginX,
        y: startY - i * lineHeight,
        size: options.fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      lineIndex++;
    }
  }

  if (lines.length === 0) {
    pdfDoc.addPage([pageWidth, pageHeight]);
  }

  return pdfDoc.save();
}

function wrapText(
  text: string,
  font: { widthOfTextAtSize: (text: string, size: number) => number },
  fontSize: number,
  maxWidth: number
): string[] {
  const paragraphs = text.split("\n");
  const wrappedLines: string[] = [];

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === "") {
      wrappedLines.push("");
      continue;
    }

    const words = paragraph.split(" ");
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth > maxWidth && currentLine) {
        wrappedLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      wrappedLines.push(currentLine);
    }
  }

  return wrappedLines;
}
