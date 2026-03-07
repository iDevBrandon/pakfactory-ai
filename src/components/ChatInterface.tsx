"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { FileText, MessageSquare, Send } from "lucide-react"
import { useEffect, useState } from "react"

interface ChatInterfaceProps {
  documentId?: string
  documentTitle?: string
}

export default function ChatInterface({
  documentId,
  documentTitle,
}: ChatInterfaceProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState("")

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        documentId,
      },
    }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && status === "ready") {
      sendMessage({ text: input })
      setInput("")
    }
  }

  const isLoading = status !== "ready"

  // Add welcome message on mount
  useEffect(() => {
    if (messages.length === 0) {
      // Manually add welcome message (since initialMessages isn't working)
      const welcomeMessage = {
        id: "welcome",
        role: "assistant" as const,
        content: documentId
          ? `Hi! I'm here to help you with questions about "${documentTitle}". What would you like to know?`
          : `Hi! I'm here to help you with questions about your uploaded documents. What would you like to know?`,
      }
      // This would need to be handled by the transport/API
    }
  }, [documentId, documentTitle, messages.length])

  if (!isExpanded) {
    return (
      <div className="fixed right-6 bottom-6 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="rounded-full bg-blue-600 p-4 text-white shadow-lg transition-colors hover:bg-blue-700"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed right-6 bottom-6 z-50 flex h-[500px] w-96 flex-col rounded-lg border border-gray-200 bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-lg bg-blue-600 p-4 text-white">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <span className="font-medium">Document Chat</span>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-blue-200 hover:text-white"
        >
          ×
        </button>
      </div>

      {/* Document Context */}
      {documentTitle && (
        <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 p-3">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="truncate text-sm text-gray-700">
            {documentTitle}
          </span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">
                {(message as any).content ||
                  (message as any).text ||
                  JSON.stringify(message)}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-gray-100 p-3 text-gray-800">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error state would be handled by useChat internally */}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              documentTitle
                ? `Ask about ${documentTitle}...`
                : "Ask about your documents..."
            }
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-lg bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
