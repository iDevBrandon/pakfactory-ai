import { processDocument } from "@/src/lib/document-processor"
import { generateFileKey, uploadFile } from "@/src/lib/storage-utils"
import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/markdown",
  "text/plain",
]

const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB - reduced for cost savings

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string
    const title = formData.get("title") as string

    // Validation
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    if (!title) {
      return NextResponse.json({ error: "Title required" }, { status: 400 })
    }

    // Validate file type
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only PDF, DOC, DOCX, MD, and TXT files are allowed.",
        },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 1MB." },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Generate unique file key
    const fileKey = generateFileKey(file.name)

    // Upload to Supabase Storage
    const fileUrl = await uploadFile({
      key: fileKey,
      file: buffer,
      contentType: file.type,
      userId,
    })

    // Ensure user exists in 'users' table (required for Demo/Local testing with new UUIDs)
    console.log(`Verifying user: ${userId}`)
    const { data: userExists, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("User check error:", checkError)
      return NextResponse.json(
        { error: "Database check failed" },
        { status: 500 }
      )
    }

    if (!userExists) {
      console.log(`User not found, creating: ${userId}`)
      const { error: userError } = await supabase.from("users").insert({
        id: userId,
        name: "Demo User",
        email: `${userId}@demo.com`,
      })

      if (userError) {
        console.error("User creation error:", userError)
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        )
      }
    }

    // Save document metadata to database
    const { data: document, error: dbError } = await supabase
      .from("documents")
      .insert({
        user_id: userId,
        title,
        file_url: fileUrl,
        file_size: file.size,
        file_type: file.type,
        processing_status: "pending",
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        { error: "Failed to save document metadata" },
        { status: 500 }
      )
    }

    // Process document sequentially to ensure embeddings are created
    console.log(`Starting document processing for: ${document.id}`)
    let processingResult
    try {
      processingResult = await processDocument(document.id)
      console.log(`Document processing completed:`, processingResult)
    } catch (error) {
      console.error("Failed to process document:", error)
      return NextResponse.json(
        {
          error: "Document saved but processing failed",
          details: error instanceof Error ? error.message : "Unknown error",
          id: document.id,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      id: document.id,
      url: fileUrl,
      title: document.title,
      size: file.size,
      type: file.type,
      status: "success",
      processing: processingResult,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

// GET endpoint to list user documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const { data: documents, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { error: "Failed to fetch documents" },
        { status: 500 }
      )
    }

    return NextResponse.json({ documents })
  } catch (error) {
    console.error("Fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    )
  }
}
