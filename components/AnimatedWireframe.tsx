"use client"

import { useEffect, useState } from "react"
import { generateShape, Shape3D } from "../utils/3d-shapes"
import { ThreeRenderer } from "./ThreeRenderer"

export default function AnimatedWireframe() {
  const [currentShape, setCurrentShape] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [userQuery, setUserQuery] = useState("")
  const [currentQuery, setCurrentQuery] = useState("")
  const [autoMode, setAutoMode] = useState(true)
  const [current3DShape, setCurrent3DShape] = useState<Shape3D | null>(() => {
    // Initialize with a default 3D box
    return generateShape("blue box")
  })

  // Array of different packaging shapes with unique wireframe designs
  const shapes = [
    {
      image:
        "data:image/svg+xml;base64," +
        btoa(`
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#36B37E;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:#00A86B;stop-opacity:0.6" />
            </linearGradient>
          </defs>
          <!-- Box wireframe with proper isometric perspective -->
          <!-- Front face -->
          <rect x="60" y="70" width="80" height="80" fill="none" stroke="url(#grad1)" stroke-width="2"/>
          <!-- Top face -->
          <path d="M60 70 L80 50 L160 50 L140 70 Z" fill="none" stroke="url(#grad1)" stroke-width="2"/>
          <!-- Right face -->
          <path d="M140 70 L160 50 L160 130 L140 150 Z" fill="none" stroke="url(#grad1)" stroke-width="2"/>
          <!-- Hidden edges (dashed) -->
          <line x1="80" y1="50" x2="80" y2="130" stroke="url(#grad1)" stroke-width="1" stroke-dasharray="3,3" opacity="0.6"/>
          <line x1="80" y1="130" x2="160" y2="130" stroke="url(#grad1)" stroke-width="1" stroke-dasharray="3,3" opacity="0.6"/>
          <line x1="80" y1="130" x2="60" y2="150" stroke="url(#grad1)" stroke-width="1" stroke-dasharray="3,3" opacity="0.6"/>
          <!-- Grid lines -->
          <line x1="60" y1="110" x2="140" y2="110" stroke="url(#grad1)" stroke-width="1" opacity="0.4"/>
          <line x1="100" y1="70" x2="100" y2="150" stroke="url(#grad1)" stroke-width="1" opacity="0.4"/>
          <line x1="120" y1="50" x2="120" y2="80" stroke="url(#grad1)" stroke-width="1" opacity="0.4"/>
        </svg>
      `),
      transform: "scale(1) rotateY(0deg) rotateX(0deg)",
      filter: "hue-rotate(0deg) saturate(1.2) brightness(1.1)",
      name: "Box Package",
    },
    {
      image:
        "data:image/svg+xml;base64," +
        btoa(`
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#36B37E;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:#00A86B;stop-opacity:0.6" />
            </linearGradient>
          </defs>
          <!-- Bottle wireframe -->
          <path d="M80 30 L120 30 L125 50 L130 70 L130 150 L125 170 L120 180 L80 180 L75 170 L70 150 L70 70 L75 50 Z" 
                fill="none" stroke="url(#grad2)" stroke-width="2"/>
          <ellipse cx="100" cy="30" rx="20" ry="8" fill="none" stroke="url(#grad2)" stroke-width="2"/>
          <ellipse cx="100" cy="180" rx="25" ry="10" fill="none" stroke="url(#grad2)" stroke-width="2"/>
          <!-- Grid lines -->
          <line x1="70" y1="90" x2="130" y2="90" stroke="url(#grad2)" stroke-width="1" opacity="0.5"/>
          <line x1="70" y1="130" x2="130" y2="130" stroke="url(#grad2)" stroke-width="1" opacity="0.5"/>
          <line x1="85" y1="50" x2="85" y2="170" stroke="url(#grad2)" stroke-width="1" opacity="0.5"/>
          <line x1="115" y1="50" x2="115" y2="170" stroke="url(#grad2)" stroke-width="1" opacity="0.5"/>
        </svg>
      `),
      transform: "scale(1.05) rotateY(15deg) rotateX(5deg)",
      filter: "hue-rotate(60deg) saturate(1.3) brightness(1.2)",
      name: "Bottle Package",
    },
    {
      image:
        "data:image/svg+xml;base64," +
        btoa(`
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#36B37E;stop-opacity:0.7" />
              <stop offset="100%" style="stop-color:#2E8B57;stop-opacity:0.5" />
            </linearGradient>
          </defs>
          <!-- Tube wireframe - cosmetic/toothpaste style -->
          <!-- Main tube body -->
          <ellipse cx="100" cy="50" rx="30" ry="12" fill="none" stroke="url(#grad3)" stroke-width="2"/>
          <ellipse cx="100" cy="140" rx="30" ry="12" fill="none" stroke="url(#grad3)" stroke-width="2"/>
          <line x1="70" y1="50" x2="70" y2="140" stroke="url(#grad3)" stroke-width="2"/>
          <line x1="130" y1="50" x2="130" y2="140" stroke="url(#grad3)" stroke-width="2"/>
          <!-- Shoulder/neck -->
          <path d="M85 50 Q100 35 115 50" fill="none" stroke="url(#grad3)" stroke-width="2"/>
          <!-- Cap -->
          <rect x="90" y="25" width="20" height="25" rx="3" fill="none" stroke="url(#grad3)" stroke-width="2"/>
          <!-- Nozzle -->
          <rect x="95" y="20" width="10" height="8" rx="2" fill="none" stroke="url(#grad3)" stroke-width="1"/>
          <!-- Crimp at bottom -->
          <path d="M75 140 L100 155 L125 140" fill="none" stroke="url(#grad3)" stroke-width="2"/>
          <line x1="85" y1="147" x2="115" y2="147" stroke="url(#grad3)" stroke-width="2"/>
          <!-- Grid lines -->
          <line x1="70" y1="75" x2="130" y2="75" stroke="url(#grad3)" stroke-width="1" opacity="0.4"/>
          <line x1="70" y1="100" x2="130" y2="100" stroke="url(#grad3)" stroke-width="1" opacity="0.4"/>
          <line x1="70" y1="120" x2="130" y2="120" stroke="url(#grad3)" stroke-width="1" opacity="0.4"/>
          <line x1="85" y1="50" x2="85" y2="140" stroke="url(#grad3)" stroke-width="1" opacity="0.3"/>
          <line x1="115" y1="50" x2="115" y2="140" stroke="url(#grad3)" stroke-width="1" opacity="0.3"/>
        </svg>
      `),
      transform: "scale(0.95) rotateY(-10deg) rotateX(-15deg)",
      filter: "hue-rotate(120deg) saturate(1.1) brightness(1.0)",
      name: "Tube Package",
    },
    {
      image:
        "data:image/svg+xml;base64," +
        btoa(`
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#36B37E;stop-opacity:0.9" />
              <stop offset="100%" style="stop-color:#228B22;stop-opacity:0.7" />
            </linearGradient>
          </defs>
          <!-- Pouch wireframe -->
          <path d="M70 50 Q100 40 130 50 L135 90 Q130 130 100 140 Q70 130 65 90 Z" 
                fill="none" stroke="url(#grad4)" stroke-width="2"/>
          <path d="M85 50 Q100 45 115 50" fill="none" stroke="url(#grad4)" stroke-width="2"/>
          <!-- Grid lines -->
          <line x1="75" y1="70" x2="125" y2="70" stroke="url(#grad4)" stroke-width="1" opacity="0.5"/>
          <line x1="75" y1="100" x2="125" y2="100" stroke="url(#grad4)" stroke-width="1" opacity="0.5"/>
          <line x1="90" y1="55" x2="85" y2="125" stroke="url(#grad4)" stroke-width="1" opacity="0.5"/>
          <line x1="110" y1="55" x2="115" y2="125" stroke="url(#grad4)" stroke-width="1" opacity="0.5"/>
          <!-- Seal lines -->
          <line x1="85" y1="135" x2="115" y2="135" stroke="url(#grad4)" stroke-width="3"/>
        </svg>
      `),
      transform: "scale(1.08) rotateY(-20deg) rotateX(10deg)",
      filter: "hue-rotate(180deg) saturate(1.4) brightness(1.3)",
      name: "Pouch Package",
    },
    {
      image:
        "data:image/svg+xml;base64," +
        btoa(`
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#36B37E;stop-opacity:0.6" />
              <stop offset="100%" style="stop-color:#006400;stop-opacity:0.4" />
            </linearGradient>
          </defs>
          <!-- Can wireframe with proper proportions -->
          <ellipse cx="100" cy="50" rx="30" ry="8" fill="none" stroke="url(#grad5)" stroke-width="2"/>
          <ellipse cx="100" cy="150" rx="30" ry="8" fill="none" stroke="url(#grad5)" stroke-width="2"/>
          <line x1="70" y1="50" x2="70" y2="150" stroke="url(#grad5)" stroke-width="2"/>
          <line x1="130" y1="50" x2="130" y2="150" stroke="url(#grad5)" stroke-width="2"/>
          <!-- Top rim and opening -->
          <ellipse cx="100" cy="45" rx="25" ry="6" fill="none" stroke="url(#grad5)" stroke-width="2"/>
          <ellipse cx="100" cy="42" rx="20" ry="4" fill="none" stroke="url(#grad5)" stroke-width="1"/>
          <!-- Tab pull -->
          <rect x="105" y="40" width="8" height="4" rx="2" fill="none" stroke="url(#grad5)" stroke-width="1"/>
          <circle cx="109" cy="42" r="1.5" fill="url(#grad5)"/>
          <!-- Label area -->
          <rect x="75" y="70" width="50" height="60" rx="3" fill="none" stroke="url(#grad5)" stroke-width="1" opacity="0.6"/>
          <!-- Grid lines for can structure -->
          <line x1="70" y1="80" x2="130" y2="80" stroke="url(#grad5)" stroke-width="1" opacity="0.4"/>
          <line x1="70" y1="110" x2="130" y2="110" stroke="url(#grad5)" stroke-width="1" opacity="0.4"/>
          <line x1="70" y1="130" x2="130" y2="130" stroke="url(#grad5)" stroke-width="1" opacity="0.4"/>
          <line x1="85" y1="50" x2="85" y2="150" stroke="url(#grad5)" stroke-width="1" opacity="0.3"/>
          <line x1="115" y1="50" x2="115" y2="150" stroke="url(#grad5)" stroke-width="1" opacity="0.3"/>
        </svg>
      `),
      transform: "scale(0.92) rotateY(25deg) rotateX(-8deg)",
      filter: "hue-rotate(240deg) saturate(1.0) brightness(0.9)",
      name: "Can Package",
    },
  ]

  // Auto-cycle effect - cycle through different 3D shapes
  useEffect(() => {
    if (!autoMode) return

    const shape3DOptions = [
      "white tulip box",
      "brown burger box", 
      "beige sandwich wedge",
      "white cake box",
      "brown tray box",
      "golden crown",
      "blue sphere"
    ]

    const interval = setInterval(() => {
      setCurrentShape((prev) => {
        const nextIndex = (prev + 1) % shape3DOptions.length
        const newShape = generateShape(shape3DOptions[nextIndex])
        setCurrent3DShape(newShape)
        return nextIndex
      })
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [autoMode])

  // Query-to-package mapping
  const getPackageFromQuery = (query: string) => {
    const lowerQuery = query.toLowerCase()

    if (
      lowerQuery.includes("drink") ||
      lowerQuery.includes("beverage") ||
      lowerQuery.includes("soda") ||
      lowerQuery.includes("juice")
    ) {
      return 4 // Can Package
    }
    if (
      lowerQuery.includes("cosmetic") ||
      lowerQuery.includes("cream") ||
      lowerQuery.includes("toothpaste") ||
      lowerQuery.includes("gel")
    ) {
      return 2 // Tube Package
    }
    if (
      lowerQuery.includes("wine") ||
      lowerQuery.includes("perfume") ||
      lowerQuery.includes("oil") ||
      lowerQuery.includes("sauce")
    ) {
      return 1 // Bottle Package
    }
    if (
      lowerQuery.includes("snack") ||
      lowerQuery.includes("chips") ||
      lowerQuery.includes("flexible") ||
      lowerQuery.includes("food")
    ) {
      return 3 // Pouch Package
    }
    // Default to box for electronics, toys, etc.
    return 0 // Box Package
  }

  const handleQuerySubmit = async () => {
    if (!userQuery.trim()) return

    setAutoMode(false)
    setIsGenerating(true)
    setCurrentQuery(userQuery)

    // Simulate AI processing time and generate 3D shape
    setTimeout(() => {
      try {
        const shape3D = generateShape(userQuery)
        setCurrent3DShape(shape3D)
        const targetPackage = getPackageFromQuery(userQuery)
        setCurrentShape(targetPackage)
        setIsGenerating(false)
      } catch (error) {
        console.error("Failed to generate 3D shape:", error)
        setIsGenerating(false)
      }
    }, 1500)
  }

  const handleReset = () => {
    setAutoMode(true)
    setUserQuery("")
    setCurrentQuery("")
    setIsGenerating(false)
    setCurrent3DShape(null)
  }

  const currentShapeData = shapes[currentShape]

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Interactive Query Input */}
      <div className="absolute top-4 right-4 left-4 z-10">
        <div className="rounded-lg border border-gray-200 bg-white/90 p-3 shadow-lg backdrop-blur-sm">
          <div className="flex gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuerySubmit()}
              placeholder="Describe packaging (e.g., 'tulip box', 'burger box', 'cake box', 'sandwich wedge')..."
              className="flex-1 rounded border border-gray-200 px-3 py-2 text-sm focus:border-[#36B37E] focus:ring-2 focus:ring-[#36B37E] focus:outline-none"
              disabled={isGenerating}
            />
            <button
              onClick={handleQuerySubmit}
              disabled={isGenerating || !userQuery.trim()}
              className="rounded bg-[#36B37E] px-4 py-2 text-sm text-white transition-colors hover:bg-[#2E8B57] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isGenerating ? "..." : "Generate"}
            </button>
            {!autoMode && (
              <button
                onClick={handleReset}
                className="rounded bg-gray-500 px-3 py-2 text-sm text-white transition-colors hover:bg-gray-600"
              >
                Reset
              </button>
            )}
          </div>

          {isGenerating && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#36B37E] border-t-transparent"></div>
              <span>
                AI is analyzing your input and generating 3D shape...
              </span>
            </div>
          )}

          {currentQuery && !isGenerating && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Query:</span> "{currentQuery}" →{" "}
              {currentShapeData.name}
            </div>
          )}
        </div>
      </div>

      {/* 3D Shape Display */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-h-md relative h-full w-full max-w-md">
          <div
            className={`h-full w-full transition-all duration-1000 ${
              isGenerating
                ? "scale-95 opacity-50 blur-sm"
                : "scale-100 opacity-100"
            }`}
          >
            {current3DShape && (
              <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50">
                <ThreeRenderer
                  vertices={current3DShape.vertices}
                  indices={current3DShape.indices}
                  colors={current3DShape.colors}
                  normals={current3DShape.normals}
                  className="w-full h-full"
                />
              </div>
            )}
          </div>

          {/* Shape type indicator */}
          <div className="absolute bottom-4 left-4 rounded-lg bg-black/70 px-3 py-2 text-sm text-white backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  autoMode
                    ? "bg-blue-400"
                    : isGenerating
                      ? "bg-yellow-400"
                      : current3DShape
                        ? "bg-purple-400"
                        : "bg-green-400"
                }`}
              ></div>
              <span>{current3DShape?.name || "3D Shape"}</span>
            </div>
            <div className="mt-1 text-xs text-gray-300">
              {autoMode
                ? "Auto Mode"
                : isGenerating
                  ? "Generating..."
                  : current3DShape
                    ? "3D Generated"
                    : "AI Generated"}
            </div>
          </div>

          {/* Interactive controls hint */}
          {current3DShape && !isGenerating && (
            <div className="absolute top-4 right-4 rounded-lg bg-black/70 px-3 py-2 text-sm text-white backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs">🔄 Auto-rotating • 🖱️ Drag to control</span>
              </div>
            </div>
          )}

          {/* AI Processing Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-lg bg-white/90 p-6 shadow-xl">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#36B37E] border-t-transparent"></div>
                  <span className="text-sm font-medium text-gray-700">
                    AI Processing...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
