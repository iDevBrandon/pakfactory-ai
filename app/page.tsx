"use client"

import AnimatedWireframe from "@/components/AnimatedWireframe"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function LandingPage() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0
        }
        return prev + 2
      })
    }, 100) // Update every 100ms

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 text-gray-900">
      {/* Header Navigation */}
      <header className="flex items-center justify-between bg-white p-4 shadow-sm lg:p-6">
        <div className="flex items-center gap-3">
          <Image
            src="/image/logo.png"
            alt="PakFactory Logo"
            width={180}
            height={40}
            className="h-8 w-auto"
          />
          <span className="text-lg font-semibold" style={{ color: "#36B37E" }}>
            AI Platform
          </span>
        </div>

        <nav className="hidden items-center gap-4 lg:flex lg:gap-8">
          <a
            href="#"
            className="font-medium text-gray-600 transition-colors hover:text-[#36B37E]"
          >
            Products
          </a>
          <a
            href="#"
            className="font-medium text-gray-600 transition-colors hover:text-[#36B37E]"
          >
            Industries
          </a>
          <a
            href="#"
            className="font-medium text-gray-600 transition-colors hover:text-[#36B37E]"
          >
            Services
          </a>
          <a
            href="#"
            className="font-medium text-gray-600 transition-colors hover:text-[#36B37E]"
          >
            Why PakFactory
          </a>
        </nav>

        <div className="flex items-center gap-2 lg:gap-4">
          <span className="hidden text-sm text-gray-600 lg:inline">
            Call us toll free:
          </span>
          <span className="hidden text-lg font-semibold text-[#36B37E] sm:inline">
            1-888-622-2819
          </span>
          <Button
            style={{ backgroundColor: "#36B37E" }}
            className="px-3 text-sm text-white hover:opacity-90 lg:px-4 lg:text-base"
          >
            <span className="hidden sm:inline">Request a Quote</span>
            <span className="sm:hidden">Quote</span>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 py-10 lg:flex-row lg:gap-0 lg:px-6 lg:py-20">
        <div className="max-w-2xl flex-1 text-center lg:text-left">
          <div className="mb-6 flex items-center justify-center gap-2 text-sm font-semibold text-[#36B37E] lg:justify-start">
            <span className="h-2 w-2 rounded-full bg-[#36B37E]"></span>
            AI-POWERED PACKAGING INNOVATION
          </div>

          <h1 className="mb-6 text-3xl sm:text-4xl lg:text-6xl leading-tight font-bold">
            The Future of
            <br />
            <span className="text-[#36B37E]">Packaging Design</span>
            <br />
            <span className="">is AI</span>
          </h1>

          <p className="mb-8 text-lg lg:text-xl leading-relaxed text-gray-700">
            Order personalized, high-quality custom printed packaging and
            branded boxes your customers will love all-in-one place.
          </p>

          <div className="mb-8 lg:mb-12 flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center lg:justify-start">
            <Button
              style={{ backgroundColor: "#36B37E" }}
              className="h-15 rounded-lg px-12 py-5 text-xl font-semibold text-white hover:opacity-90"
            >
              Request a Quote
            </Button>
            <Link href="/workspace">
              <Button
                variant="outline"
                style={{ borderColor: "#36B37E", color: "#36B37E" }}
                className="h-15 rounded-lg bg-white px-12 py-5 text-xl font-semibold hover:bg-gray-50"
              >
                Try AI Assistant
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <div className="flex items-center gap-2">
              <div className="flex text-[#36B37E]">⭐⭐⭐⭐⭐</div>
              <span className="text-sm text-gray-600 underline">
                4.6 Google Reviews
              </span>
            </div>
            <span className="font-medium text-gray-700">
              3,000+ brands big and small love us!
            </span>
          </div>
        </div>

        {/* 3D Visualization */}
        <div className="flex flex-1 justify-center w-full">
          <div className="relative w-full max-w-md lg:max-w-lg">
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-2xl">
              {/* Dot pattern background */}
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, #36B37E 1px, transparent 0)`,
                  backgroundSize: "24px 24px",
                }}
              ></div>

              {/* 3D Wireframe Mesh */}
              <AnimatedWireframe />

              {/* Processing indicator */}
              <div
                className="border-opacity-30 absolute right-6 bottom-6 max-w-50 rounded-lg border p-4 backdrop-blur-md"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  borderColor: "#36B37E",
                }}
              >
                <p
                  className="mb-1 text-[10px] font-bold uppercase"
                  style={{ color: "#36B37E" }}
                >
                  LIVE PROCESSING
                </p>
                <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-gray-700">
                  <div
                    className="h-full rounded-full transition-all duration-100"
                    style={{
                      backgroundColor: "#36B37E",
                      width: `${progress}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs leading-tight text-gray-100">
                  Optimizing structural integrity for corrugated fiberboard...
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Core Capabilities Section */}
      <section className="mx-auto max-w-7xl px-4 lg:px-6 py-12 lg:py-20">
        <div className="mb-12 lg:mb-16 text-center">
          <div className="mb-4 text-sm font-semibold text-[#36B37E]">
            WHAT WE OFFER
          </div>
          <h2 className="mb-4 text-2xl lg:text-4xl font-bold text-gray-900">
            We are your best solution for{" "}
            <span className="text-[#36B37E]">Custom Packaging</span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg lg:text-xl text-gray-700">
            Never worry about going to multiple sources to get your dream
            packaging.
          </p>
        </div>

        <div className="grid gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* AI-Driven Design */}
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-shadow hover:shadow-xl">
            <div
              style={{ backgroundColor: "#36B37E" }}
              className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg"
            >
              <span className="text-xl text-white">📦</span>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Custom Boxes
            </h3>
            <p className="mb-6 text-gray-600">
              Design and order custom printed boxes tailored to your brand. From
              small jewelry boxes to large shipping containers.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-[#36B37E]"></div>
                Free design consultation
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-[#36B37E]"></div>
                Fast turnaround times
              </li>
            </ul>
          </div>

          {/* Global Standards (RAG) */}
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-shadow hover:shadow-xl">
            <div
              style={{ backgroundColor: "#36B37E" }}
              className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg"
            >
              <span className="text-xl text-white">🎨</span>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Custom Printing
            </h3>
            <p className="mb-6 text-gray-600">
              High-quality printing options including full-color, foil stamping,
              embossing, and spot UV to make your packaging stand out.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-[#36B37E]"></div>
                Premium printing options
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-[#36B37E]"></div>
                Eco-friendly materials
              </li>
            </ul>
          </div>

          {/* Material Intelligence */}
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-shadow hover:shadow-xl">
            <div
              style={{ backgroundColor: "#36B37E" }}
              className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg"
            >
              <span className="text-xl text-white">🤖</span>
            </div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              AI Design Assistant
            </h3>
            <p className="mb-6 text-gray-600">
              Our AI-powered platform helps you design the perfect packaging
              solution based on your product requirements and brand guidelines.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-[#36B37E]"></div>
                Instant design suggestions
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-[#36B37E]"></div>
                Material optimization
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 lg:px-6 py-12 lg:py-20">
        <div
          style={{
            borderColor: "#36B37E",
            background: "linear-gradient(to right, #36B37E1A, #36B37E20)",
          }}
          className="mx-auto max-w-4xl rounded-2xl border p-6 lg:p-12 text-center"
        >
          <h2 className="mb-6 text-2xl lg:text-4xl font-bold text-gray-900">
            Ready to create your dream packaging?
          </h2>
          <p className="mb-8 text-lg lg:text-xl text-gray-700">
            Join thousands of brands who trust PakFactory for their custom
            packaging needs. Get started today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 lg:gap-6">
            <Button
              style={{ backgroundColor: "#36B37E" }}
              className="h-12 lg:h-15 rounded-lg px-8 lg:px-12 py-3 lg:py-5 text-lg lg:text-xl font-semibold text-white hover:opacity-90 w-full sm:w-auto"
            >
              Request a Quote
            </Button>
            <Link href="/workspace" className="w-full sm:w-auto">
              <Button
                variant="outline"
                style={{ borderColor: "#36B37E", color: "#36B37E" }}
                className="h-12 lg:h-15 rounded-lg bg-white px-8 lg:px-12 py-3 lg:py-5 text-lg lg:text-xl font-semibold hover:bg-gray-50 w-full sm:w-auto"
              >
                Try AI Assistant
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 lg:px-6 py-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/image/logo.png"
                alt="PakFactory Logo"
                width={180}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-[#36B37E]">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-500 hover:text-[#36B37E]">
                <span className="sr-only">LinkedIn</span>
                💼
              </a>
            </div>
          </div>

          <div className="mb-8 grid gap-6 grid-cols-2 lg:gap-8 lg:grid-cols-4">
            <div>
              <h4 className="mb-4 font-semibold text-gray-900">PRODUCTS</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-[#36B37E]">
                    Custom Boxes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#36B37E]">
                    Packaging Bags
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#36B37E]">
                    Labels & Stickers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-gray-900">COMPANY</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-[#36B37E]">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#36B37E]">
                    Reviews
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#36B37E]">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-gray-900">SUPPORT</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-[#36B37E]">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#36B37E]">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#36B37E]">
                    Shipping Info
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-gray-900">LEGAL</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-[#36B37E]">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#36B37E]">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#36B37E]">
                    Returns
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6 lg:pt-8 text-sm text-gray-500">
            <p>© 2024 PakFactory. All rights reserved.</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <span>🔒 Secure Checkout</span>
              <span>📞 1-888-622-2819</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
