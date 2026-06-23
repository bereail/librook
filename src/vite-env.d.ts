/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// BarcodeDetector Web API (not yet in standard TypeScript lib)
interface BarcodeDetectorResult {
  rawValue: string
  format: string
}

interface BarcodeDetector {
  detect(
    source: HTMLVideoElement | HTMLCanvasElement | ImageBitmap | ImageData
  ): Promise<BarcodeDetectorResult[]>
}

declare var BarcodeDetector: {
  prototype: BarcodeDetector
  new (options?: { formats: string[] }): BarcodeDetector
  getSupportedFormats(): Promise<string[]>
}
