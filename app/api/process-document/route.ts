import { NextRequest, NextResponse } from "next/server"
import { processDocument } from "@/src/lib/document-processor"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { documentId } = await request.json()

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID required" },
        { status: 400 }
      )
    }

    // Process the document using our utility function
    const result = await processDocument(documentId)
    
    return NextResponse.json(result)

  } catch (error) {
    console.error("Document processing error:", error)
    return NextResponse.json(
      { 
        error: "Document processing failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check processing status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get("documentId")

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID required" },
        { status: 400 }
      )
    }

    const { data: document, error } = await supabase
      .from("documents")
      .select("processing_status, total_chunks, total_tokens, error_message")
      .eq("id", documentId)
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      documentId,
      status: document.processing_status,
      totalChunks: document.total_chunks,
      totalTokens: document.total_tokens,
      errorMessage: document.error_message
    })

  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json(
      { error: "Status check failed" },
      { status: 500 }
    )
  }
}