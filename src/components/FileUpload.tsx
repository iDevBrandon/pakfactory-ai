"use client"

import { AlertCircle, CheckCircle, FileText, Upload, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"

interface UploadedFile {
  id: string
  file: File
  status: "uploading" | "success" | "error"
  progress: number
  error?: string
  url?: string
}

interface FileUploadProps {
  onUploadComplete?: (
    files: { id: string; url: string; title: string }[]
  ) => void
  maxFiles?: number
  userId: string
  initialFiles?: File[]
}

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "text/markdown": [".md"],
  "text/plain": [".txt"],
}

const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB - reduced for cost savings

export default function FileUpload({
  onUploadComplete,
  maxFiles = 1,
  userId,
  initialFiles,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const initialUploadStarted = useRef(false)

  const uploadFile = async (
    file: File
  ): Promise<{ url: string; title: string }> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("userId", userId)
    formData.append("title", file.name.replace(/\.[^/.]+$/, "")) // Remove extension for title

    const response = await fetch("/api/upload-document", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || "Upload failed")
    }

    const result = await response.json()
    return result
  }

  const handleFileUpload = async (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2),
      file,
      status: "uploading" as const,
      progress: 0,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])

    const uploadPromises = newFiles.map(async (fileObj) => {
      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? { ...f, progress: Math.min(f.progress + 10, 90) }
                : f
            )
          )
        }, 200)

        const result = await uploadFile(fileObj.file)

        clearInterval(progressInterval)

        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileObj.id
              ? { ...f, status: "success", progress: 100, url: result.url }
              : f
          )
        )

        return { id: fileObj.id, url: result.url, title: result.title }
      } catch (error) {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileObj.id
              ? {
                  ...f,
                  status: "error",
                  error:
                    error instanceof Error ? error.message : "Upload failed",
                }
              : f
          )
        )
        throw error
      }
    })

    try {
      const results = await Promise.allSettled(uploadPromises)
      const successfulUploads = results
        .filter(
          (
            result
          ): result is PromiseFulfilledResult<{
            id: string
            url: string
            title: string
          }> => result.status === "fulfilled"
        )
        .map((result) => result.value)

      if (successfulUploads.length > 0 && onUploadComplete) {
        onUploadComplete(successfulUploads)
      }
    } catch (error) {
      console.error("Upload error:", error)
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[], event: any) => {
      if (event) event.stopPropagation()
      // Show warning for rejected files
      if (rejectedFiles.length > 0) {
        const rejectedFile = rejectedFiles[0].file
        const error = rejectedFiles[0].errors[0]

        if (error.code === "file-invalid-type") {
          alert(
            `File type not supported: ${rejectedFile.name}\n\nSupported formats: PDF, DOC, DOCX, MD, TXT`
          )
        } else if (error.code === "file-too-large") {
          alert(`File too large: ${rejectedFile.name}\n\nMaximum size: 1MB`)
        } else {
          alert(`Upload error: ${error.message}`)
        }
        return
      }

      handleFileUpload(acceptedFiles)
    },
    []
  )

  // Handle initial files from global drag and drop
  useEffect(() => {
    if (
      initialFiles &&
      initialFiles.length > 0 &&
      !initialUploadStarted.current
    ) {
      initialUploadStarted.current = true
      handleFileUpload(initialFiles)
    }
  }, [initialFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    maxFiles: maxFiles - uploadedFiles.length,
    disabled: uploadedFiles.length >= maxFiles,
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    return <FileText className="h-4 w-4" />
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        )
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"} ${uploadedFiles.length >= maxFiles ? "cursor-not-allowed opacity-50" : ""} `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />

        {isDragActive ? (
          <div className="space-y-2">
            <p className="text-lg font-bold text-blue-600">
              📁 Drop your file here
            </p>
            <p className="text-sm text-blue-500">Release to upload</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-medium text-gray-600">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF, DOC, DOCX, MD, TXT files up to 1MB
            </p>
            <p className="text-xs text-gray-400">
              Upload 1 file at a time (cost-optimized)
            </p>
          </div>
        )}
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
              >
                <div className="flex flex-1 items-center space-x-3">
                  {getFileIcon(file.file.name)}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {file.status === "uploading" && (
                    <div className="h-2 w-20 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}

                  {getStatusIcon(file.status)}

                  {file.status !== "uploading" && (
                    <button
                      onClick={() => removeFile(file.id)}
                      className="rounded p-1 hover:bg-gray-200"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
