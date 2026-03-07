import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    // Test connection by getting document chunks
    const { data, error } = await supabase
      .from("document_chunks")
      .select("*")
      .limit(3)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Database connection failed", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Supabase connection working!",
      sampleDocuments: data?.length || 0,
      data: data,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    const supabase = await createClient()
    // Test creating a chat session
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert([{ title: "Test Session" }])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Failed to create session", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Chat session created successfully!",
      session: data,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
