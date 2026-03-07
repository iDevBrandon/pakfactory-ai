"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function WorkspacePage() {
  const [userMessage, setUserMessage] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      content:
        "Show me some eco-friendly packaging options for luxury perfumes. I need something that feels premium but meets our 2024 sustainability targets.",
      isUser: true,
    },
    {
      id: 2,
      content: `Based on your luxury brand requirements and the "Eco-Luxe 2024" initiative, I recommend the following material matrix for your perfume line:

**Glass Solution**
100% Post-Consumer Recycled (PCR) glass with a thin-wall mold to reduce weight by 15% without sacrificing the "heft" consumers expect.

**Outer Box**
FSC-certified uncoated 350gsm paper. Instead of plastic lamination, we use a water-based tactile coating for premium soft-touch finish.

These selections reduce your carbon footprint by approximately 42% compared to standard luxury perfume packaging. Would you like to see the structural templates for these materials?`,
      isUser: false,
    },
  ])

  const handleSendMessage = () => {
    if (!userMessage.trim()) return

    const newUserMessage = {
      id: messages.length + 1,
      content: userMessage,
      isUser: true,
    }

    setMessages([...messages, newUserMessage])
    setUserMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        content:
          "I'll analyze your requirements and provide customized packaging recommendations based on our industrial database...",
        isUser: false,
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <div className="fixed inset-0 flex h-[100dvh] w-screen overflow-hidden bg-gray-50 text-gray-900">
      {/* Mobile overlay */}
      {(sidebarOpen || rightSidebarOpen) && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
          onClick={() => {
            setSidebarOpen(false)
            setRightSidebarOpen(false)
          }}
        />
      )}

      {/* Left Sidebar */}
      <div
        className={`fixed z-50 flex h-full w-80 transform flex-col border-r border-gray-200 bg-white shadow-sm transition-transform duration-300 ease-in-out lg:relative lg:h-screen ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-4 lg:p-6">
          <Link href="/" className="flex items-center justify-center gap-3">
            <Image
              src="/image/logo.png"
              alt="PakFactory Logo"
              width={140}
              height={32}
              className="h-6 w-auto"
            />
            <div>
              <div className="text-[#36B37E]-600 text-sm font-semibold">
                AI CONSULTANT V1.0
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 lg:p-6">
          <div className="space-y-4">
            <div
              style={{ backgroundColor: "#36B37E1A", borderColor: "#36B37E4D" }}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <div
                style={{ backgroundColor: "#36B37E" }}
                className="h-2 w-2 rounded-full"
              ></div>
              <span style={{ color: "#36B37E" }} className="font-medium">
                Projects
              </span>
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200 bg-white p-4 lg:p-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-linear-to-r from-green-400 to-blue-400"></div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                Design Professional
              </div>
              <div className="text-xs text-gray-500">Premium Account</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden lg:w-auto">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white p-4 shadow-sm lg:p-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:text-[#36B37E]-600 rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div
              style={{ backgroundColor: "#36B37E" }}
              className="flex h-6 w-6 items-center justify-center rounded"
            >
              <span className="text-xs text-white">🤖</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 lg:text-sm">
              AI Assistant
            </h1>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Mobile analysis panel toggle */}
            <button
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
              className="hover:text-[#36B37E]-600 rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Chat Content */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Chat Area */}
          <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4 lg:space-y-6 lg:p-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 lg:gap-4 ${message.isUser ? "justify-end" : ""}`}
                >
                  {!message.isUser && (
                    <div
                      style={{ backgroundColor: "#36B37E" }}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg lg:h-8 lg:w-8"
                    >
                      <span className="text-xs text-white">🤖</span>
                    </div>
                  )}

                  <div
                    style={message.isUser ? { backgroundColor: "#36B37E" } : {}}
                    className={`max-w-xs sm:max-w-md lg:max-w-2xl ${message.isUser ? "text-white" : "border border-gray-200 bg-white text-gray-900 shadow-sm"} rounded-2xl p-3 lg:p-6`}
                  >
                    <div className="text-base whitespace-pre-wrap lg:text-lg">
                      {message.content}
                    </div>

                    {!message.isUser && message.id === 2 && (
                      <div className="mt-4 grid grid-cols-1 gap-3 lg:mt-6 lg:grid-cols-2 lg:gap-4">
                        <div className="bg-[#36B37E]-50 rounded-lg border border-gray-200 p-3 lg:p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="text-[#36B37E]-600">🥃</span>
                            <span className="text-[#36B37E]-700 text-sm font-semibold lg:text-base">
                              Glass Solution
                            </span>
                          </div>
                          <p className="text-xs text-gray-700 lg:text-sm">
                            100% Post-Consumer Recycled (PCR) glass with a
                            thin-wall mold to reduce weight by 15% without
                            sacrificing the "heft" consumers expect.
                          </p>
                        </div>

                        <div className="bg-[#36B37E]-50 rounded-lg border border-gray-200 p-3 lg:p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="text-[#36B37E]-600">📦</span>
                            <span className="text-[#36B37E]-700 text-sm font-semibold lg:text-base">
                              Outer Box
                            </span>
                          </div>
                          <p className="text-xs text-gray-700 lg:text-sm">
                            FSC-certified uncoated 350gsm paper. Instead of
                            plastic lamination, we use a water-based tactile
                            coating for premium soft-touch finish.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {message.isUser && (
                    <div className="h-6 w-6 shrink-0 rounded-full bg-linear-to-r from-green-400 to-blue-400 lg:h-8 lg:w-8"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="relative z-50 flex-shrink-0 border-t border-gray-200 bg-white p-4 lg:p-6">
              <div className="relative">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask about materials, costs..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 pr-10 text-base text-gray-900 focus:ring-2 focus:ring-[#36B37E] focus:outline-none lg:px-4 lg:py-3 lg:pr-14 lg:text-lg"
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute top-1/2 right-1.5 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg bg-[#36B37E] text-white transition-transform hover:scale-105 lg:right-2.5 lg:h-9 lg:w-9"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lg:h-4 lg:w-4"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div
            className={`fixed top-0 right-0 z-50 flex h-full w-80 transform flex-col border-l border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:relative lg:h-screen ${
              rightSidebarOpen
                ? "translate-x-0"
                : "translate-x-full lg:translate-x-0"
            }`}
          >
            {/* Technical Analysis */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              {/* Mobile close button */}
              <div className="mb-4 flex items-center justify-between lg:mb-0">
                <div></div>
                <button
                  onClick={() => setRightSidebarOpen(false)}
                  className="hover:text-[#36B37E]-600 rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-4 flex items-center gap-2">
                <span className="text-[#36B37E]-600 text-base lg:text-lg">
                  ⚙️
                </span>
                <h3 className="text-[#36B37E]-700 text-sm font-semibold lg:text-base">
                  TECHNICAL ANALYSIS
                </h3>
              </div>

              {/* Source Documents */}
              <div className="mb-4 lg:mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <div className="bg-[#36B37E]-500 h-3 w-3 rounded lg:h-4 lg:w-4"></div>
                  <span className="text-sm font-medium text-gray-900 lg:text-base">
                    Source Documents
                  </span>
                  <span className="bg-[#36B37E]-500 rounded px-2 py-1 text-xs text-black">
                    RAG
                  </span>
                </div>

                <div className="space-y-2 lg:space-y-3">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs lg:p-3 lg:text-sm">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-gray-600">📄</span>
                      <span className="text-xs font-medium text-gray-900 lg:text-sm">
                        LuxeGlass_Sustainability_2024.pdf
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Relevant pages: 12-18
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs lg:p-3 lg:text-sm">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-gray-600">📄</span>
                      <span className="text-xs font-medium text-gray-900 lg:text-sm">
                        Recycled_Paper_Specs_V4.pdf
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Relevant pages: 45
                    </div>
                  </div>
                </div>
              </div>

              {/* Material Specs */}
              <div className="mb-4 lg:mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-[#36B37E]-600 text-base lg:text-lg">
                    🧪
                  </span>
                  <span className="text-sm font-medium text-gray-900 lg:text-base">
                    Material Specs
                  </span>
                </div>

                <div className="space-y-2 text-xs lg:space-y-3 lg:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Density</span>
                    <span className="text-gray-900">2.52 g/cm³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Opacity</span>
                    <span className="text-gray-900">98.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Moisture Barrier</span>
                    <span className="text-[#36B37E]-600 font-medium">HIGH</span>
                  </div>
                </div>
              </div>

              {/* Sustainability Scores */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-[#36B37E]-600 text-base lg:text-lg">
                    🌱
                  </span>
                  <span className="text-sm font-medium text-gray-900 lg:text-base">
                    Sustainability Scores
                  </span>
                </div>

                <div className="space-y-2 lg:space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-xs lg:text-sm">
                      <span>CARBON IMPACT</span>
                      <span>85/100</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-200 lg:h-2">
                      <div
                        className="h-1.5 rounded-full lg:h-2"
                        style={{ backgroundColor: "#36B37E", width: "85%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-xs lg:text-sm">
                      <span>RECYCLABILITY</span>
                      <span>94/100</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-200 lg:h-2">
                      <div
                        className="h-1.5 rounded-full lg:h-2"
                        style={{ backgroundColor: "#36B37E", width: "94%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-xs lg:text-sm">
                      <span>MATERIAL EFFICIENCY</span>
                      <span>72/100</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-200 lg:h-2">
                      <div
                        className="h-1.5 rounded-full lg:h-2"
                        style={{ backgroundColor: "#36B37E", width: "72%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
