import mammoth from "mammoth"
import { marked } from "marked"
import path from "node:path"

export interface ExtractedText {
  content: string
  metadata: {
    pageCount?: number
    wordCount: number
    characterCount: number
  }
}

/**
 * Extract text from PDF files using pdf-parse
 */
export async function extractPdfText(buffer: Buffer): Promise<ExtractedText> {
  try {
    // pdf-parse version 2.4.5 (Mehmet Kozan's version) uses a named export PDFParse class
    const { PDFParse } = await import("pdf-parse")

    // Fix for Next.js/Turbopack: set absolute path to worker to avoid "module not found" errors
    try {
      const workerPath = path.resolve(
        process.cwd(),
        "node_modules/pdf-parse/dist/pdf-parse/cjs/pdf.worker.mjs"
      )
      // Use file:// prefix for ESM compatibility in some environments
      PDFParse.setWorker(`file://${workerPath}`)
    } catch (e) {
      console.warn("PDF worker path configuration failed:", e)
    }

    const parser = new PDFParse({
      data: buffer,
      verbosity: 0,
      isOffscreenCanvasSupported: false,
    })
    const data = await parser.getText()

    const content = data.text.trim() || "[No text content found in PDF]"

    return {
      content,
      metadata: {
        pageCount: data.total || 1,
        wordCount: content
          .split(/\s+/)
          .filter((word: string) => word.length > 0).length,
        characterCount: content.length,
      },
    }
  } catch (error) {
    console.error("PDF parsing error:", error)
    // Fallback with error info
    const fallbackText = `[PDF Processing Error: ${error instanceof Error ? error.message : "Unknown error"}]\nDocument size: ${Math.round(buffer.length / 1024)}KB\nPlease try re-uploading or use a different file format.`

    return {
      content: fallbackText,
      metadata: {
        pageCount: 1,
        wordCount: fallbackText.split(/\s+/).length,
        characterCount: fallbackText.length,
      },
    }
  }
}

/**
 * Extract text from Word documents (.docx)
 */
export async function extractWordText(buffer: Buffer): Promise<ExtractedText> {
  try {
    const result = await mammoth.extractRawText({ buffer })
    const content = result.value

    return {
      content,
      metadata: {
        wordCount: content.split(/\s+/).filter((word) => word.length > 0)
          .length,
        characterCount: content.length,
      },
    }
  } catch (error) {
    throw new Error(
      `Word extraction failed: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}

/**
 * Extract text from Markdown files
 */
export async function extractMarkdownText(
  content: string
): Promise<ExtractedText> {
  try {
    // Remove markdown syntax and get plain text
    const plainText = marked.parse(content, { async: false }) as string
    // Strip HTML tags
    const textContent = plainText.replace(/<[^>]*>/g, "").trim()

    return {
      content: textContent,
      metadata: {
        wordCount: textContent.split(/\s+/).filter((word) => word.length > 0)
          .length,
        characterCount: textContent.length,
      },
    }
  } catch (error) {
    throw new Error(
      `Markdown extraction failed: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}

/**
 * Extract text from plain text files
 */
export async function extractPlainText(
  content: string
): Promise<ExtractedText> {
  return {
    content: content.trim(),
    metadata: {
      wordCount: content.split(/\s+/).filter((word) => word.length > 0).length,
      characterCount: content.length,
    },
  }
}

/**
 * Main text extraction function that handles different file types
 */
export async function extractText(
  buffer: Buffer,
  mimeType: string
): Promise<ExtractedText> {
  switch (mimeType) {
    case "application/pdf":
      return extractPdfText(buffer)

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return extractWordText(buffer)

    case "text/markdown":
      return extractMarkdownText(buffer.toString("utf-8"))

    case "text/plain":
      return extractPlainText(buffer.toString("utf-8"))

    default:
      throw new Error(`Unsupported file type: ${mimeType}`)
  }
}
