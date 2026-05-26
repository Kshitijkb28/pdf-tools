export interface FileWithPreview {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  pageCount?: number;
}

export interface ProcessingState {
  status: "idle" | "processing" | "complete" | "error";
  progress: number;
  message?: string;
  error?: string;
}

export interface SplitOptions {
  mode: "ranges" | "individual" | "fixed";
  ranges?: string;
  fixedSize?: number;
}

export interface WatermarkOptions {
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  color: string;
  position: "center" | "tiled" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export interface PageNumberOptions {
  position: "bottom-center" | "bottom-left" | "bottom-right" | "top-center" | "top-left" | "top-right";
  format: "numeric" | "roman" | "alphabetic";
  startFrom: number;
  fontSize: number;
  margin: number;
}

export interface CompressOptions {
  quality: "low" | "medium" | "high" | "maximum";
}

export interface ProtectOptions {
  userPassword: string;
  ownerPassword?: string;
}
