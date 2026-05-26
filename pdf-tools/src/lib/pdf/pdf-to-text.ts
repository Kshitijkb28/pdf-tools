import * as pdfjsLib from "pdfjs-dist";
import type { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";

pdfjsLib.GlobalWorkerOptions.workerSrc = "";

function isTextItem(item: TextItem | TextMarkedContent): item is TextItem {
  return "str" in item;
}

export async function pdfToText(input: Uint8Array | ArrayBuffer): Promise<string> {
  const data = input instanceof ArrayBuffer ? new Uint8Array(input) : input;
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const textParts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .filter(isTextItem)
      .map((item) => item.str)
      .join(" ");
    textParts.push(pageText);
  }

  return textParts.join("\n\n");
}
