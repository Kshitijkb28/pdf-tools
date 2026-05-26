import { Merge, Scissors, RotateCw, ArrowUpDown, Image, FileImage, Minimize2, Droplets, Hash, PenTool, Lock, Unlock, Trash2, FileOutput, FileText, FileEdit, Layers, AlignVerticalSpaceAround, Type } from "lucide-react";
import { ComponentType } from "react";

export type ToolCategory = "organize" | "convert" | "optimize" | "edit" | "security";

export interface ToolDefinition {
  name: string;
  slug: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
  category: ToolCategory;
}

export const CATEGORY_COLORS: Record<ToolCategory, string> = {
  organize: "#FF6D00",
  convert: "#43A047",
  optimize: "#00897B",
  edit: "#1E88E5",
  security: "#7B1FA2",
};

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  organize: "Organize",
  convert: "Convert",
  optimize: "Optimize",
  edit: "Edit",
  security: "Security",
};

export const TOOLS: ToolDefinition[] = [
  {
    name: "Merge PDF",
    slug: "merge-pdf",
    description: "Combine multiple PDF files into one document",
    icon: Merge,
    color: "text-red-500",
    gradient: "from-red-500 to-orange-500",
    category: "organize",
  },
  {
    name: "Split PDF",
    slug: "split-pdf",
    description: "Separate one PDF into multiple documents",
    icon: Scissors,
    color: "text-orange-500",
    gradient: "from-orange-500 to-amber-500",
    category: "organize",
  },
  {
    name: "Rotate PDF",
    slug: "rotate-pdf",
    description: "Rotate PDF pages to the correct orientation",
    icon: RotateCw,
    color: "text-amber-500",
    gradient: "from-amber-500 to-yellow-500",
    category: "organize",
  },
  {
    name: "Organize Pages",
    slug: "organize-pages",
    description: "Reorder, delete, and rearrange PDF pages",
    icon: ArrowUpDown,
    color: "text-yellow-600",
    gradient: "from-yellow-500 to-lime-500",
    category: "organize",
  },
  {
    name: "JPG to PDF",
    slug: "jpg-to-pdf",
    description: "Convert images to PDF documents",
    icon: Image,
    color: "text-green-500",
    gradient: "from-green-500 to-emerald-500",
    category: "convert",
  },
  {
    name: "PDF to JPG",
    slug: "pdf-to-jpg",
    description: "Convert PDF pages to image files",
    icon: FileImage,
    color: "text-emerald-500",
    gradient: "from-emerald-500 to-teal-500",
    category: "convert",
  },
  {
    name: "Compress PDF",
    slug: "compress-pdf",
    description: "Reduce PDF file size while maintaining quality",
    icon: Minimize2,
    color: "text-teal-500",
    gradient: "from-teal-500 to-cyan-500",
    category: "optimize",
  },
  {
    name: "Watermark",
    slug: "watermark",
    description: "Add text or image watermarks to your PDF",
    icon: Droplets,
    color: "text-cyan-500",
    gradient: "from-cyan-500 to-blue-500",
    category: "edit",
  },
  {
    name: "Page Numbers",
    slug: "page-numbers",
    description: "Add page numbers to your PDF document",
    icon: Hash,
    color: "text-blue-500",
    gradient: "from-blue-500 to-indigo-500",
    category: "edit",
  },
  {
    name: "Sign PDF",
    slug: "sign-pdf",
    description: "Draw your signature and place it on the PDF",
    icon: PenTool,
    color: "text-indigo-500",
    gradient: "from-indigo-500 to-violet-500",
    category: "edit",
  },
  {
    name: "Protect PDF",
    slug: "protect-pdf",
    description: "Encrypt your PDF with a password",
    icon: Lock,
    color: "text-violet-500",
    gradient: "from-violet-500 to-purple-500",
    category: "security",
  },
  {
    name: "Unlock PDF",
    slug: "unlock-pdf",
    description: "Remove password protection from PDF",
    icon: Unlock,
    color: "text-purple-500",
    gradient: "from-purple-500 to-fuchsia-500",
    category: "security",
  },
  {
    name: "Delete Pages",
    slug: "delete-pages",
    description: "Remove unwanted pages from your PDF",
    icon: Trash2,
    color: "text-orange-600",
    gradient: "from-orange-500 to-red-500",
    category: "organize",
  },
  {
    name: "Extract Pages",
    slug: "extract-pages",
    description: "Extract specific pages into a new PDF",
    icon: FileOutput,
    color: "text-orange-500",
    gradient: "from-orange-500 to-amber-500",
    category: "organize",
  },
  {
    name: "PDF to Text",
    slug: "pdf-to-text",
    description: "Extract text content from your PDF",
    icon: FileText,
    color: "text-green-600",
    gradient: "from-green-500 to-emerald-500",
    category: "convert",
  },
  {
    name: "TXT to PDF",
    slug: "txt-to-pdf",
    description: "Convert plain text into a PDF document",
    icon: Type,
    color: "text-green-500",
    gradient: "from-green-500 to-teal-500",
    category: "convert",
  },
  {
    name: "Edit Metadata",
    slug: "edit-metadata",
    description: "Edit PDF title, author, and properties",
    icon: FileEdit,
    color: "text-blue-500",
    gradient: "from-blue-500 to-indigo-500",
    category: "edit",
  },
  {
    name: "Flatten PDF",
    slug: "flatten-pdf",
    description: "Flatten form fields and annotations",
    icon: Layers,
    color: "text-teal-600",
    gradient: "from-teal-500 to-cyan-500",
    category: "optimize",
  },
  {
    name: "Header & Footer",
    slug: "header-footer",
    description: "Add headers and footers to PDF pages",
    icon: AlignVerticalSpaceAround,
    color: "text-blue-600",
    gradient: "from-blue-500 to-cyan-500",
    category: "edit",
  },
];

export const MAX_FILE_SIZE = 100 * 1024 * 1024;
export const ACCEPTED_PDF_TYPES = ["application/pdf"];
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
