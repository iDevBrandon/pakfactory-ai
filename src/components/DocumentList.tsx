"use client"

import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Trash2,
} from "lucide-react"
import { useEffect, useState } from "react"

interface Document {
  id: string
  title: string
  file_url: string
  file_size: number
  file_type: string
  processing_status: "pending" | "processing" | "completed" | "failed"
  created_at: string
  updated_at: string
}

interface DocumentListProps {
  userId: string
  onDocumentSelect?: (document: Document) => void
  refreshTrigger?: number
}

export default function DocumentList({
  userId,
  onDocumentSelect,
  refreshTrigger = 0,
}: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/upload-document?userId=${userId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch documents")
      }

      const data = await response.json()
      setDocuments(data.documents || [])
    } catch (error) {
      console.error("Fetch error:", error)
      setError(
        error instanceof Error ? error.message : "Failed to load documents"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchDocuments()
    }
  }, [userId, refreshTrigger])

  const handleDelete = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return
    }

    try {
      const response = await fetch(`/api/upload-document/${documentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete document")
      }

      // Remove from local state
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete document")
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    return <FileText className="h-5 w-5 text-blue-600" />
  }

  const getStatusIcon = (status: Document["processing_status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusText = (status: Document["processing_status"]) => {
    switch (status) {
      case "completed":
        return "Processed"
      case "processing":
        return "Processing"
      case "failed":
        return "Failed"
      default:
        return "Pending"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="ml-3 text-gray-600">Loading documents...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <AlertCircle className="mx-auto mb-4 h-12 w-12" />
        <p className="font-medium">Error loading documents</p>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <button
          onClick={fetchDocuments}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
        <p className="font-medium">No documents uploaded</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Your Documents</h3>
        <span className="text-sm text-gray-500">
          {documents.length} documents
        </span>
      </div>

      <div className="space-y-3">
        {documents.map((document) => (
          <div
            key={document.id}
            className="group cursor-pointer rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300 hover:bg-gray-50"
            onClick={() => onDocumentSelect?.(document)}
          >
            <div className="flex items-start justify-between">
              <div className="flex min-w-0 flex-1 items-start space-x-3">
                {getFileIcon(document.file_type)}

                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-medium text-gray-900 mb-1">
                    {document.title}
                  </h4>
                  <div className="flex flex-col space-y-1 text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span>{formatFileSize(document.file_size)}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(document.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(document.processing_status)}
                      <span className="text-xs font-medium">
                        {getStatusText(document.processing_status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(document.id)
                }}
                className="ml-2 rounded p-1 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-100 flex-shrink-0"
                title="Delete document"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
