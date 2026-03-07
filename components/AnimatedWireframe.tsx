"use client"

import { useEffect, useState } from "react"

export default function AnimatedWireframe() {
  const [currentShape, setCurrentShape] = useState(0)
  
  // Array of different transforms and filters for shape morphing
  const shapes = [
    { transform: 'scale(1) rotateY(0deg) rotateX(0deg)', filter: 'hue-rotate(0deg) saturate(1.2) brightness(1.1)' },
    { transform: 'scale(1.05) rotateY(10deg) rotateX(5deg)', filter: 'hue-rotate(60deg) saturate(1.3) brightness(1.2)' },
    { transform: 'scale(0.95) rotateY(-5deg) rotateX(-10deg)', filter: 'hue-rotate(120deg) saturate(1.1) brightness(1.0)' },
    { transform: 'scale(1.02) rotateY(-15deg) rotateX(8deg)', filter: 'hue-rotate(180deg) saturate(1.4) brightness(1.3)' },
    { transform: 'scale(0.98) rotateY(8deg) rotateX(-5deg)', filter: 'hue-rotate(240deg) saturate(1.0) brightness(0.9)' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShape((prev) => (prev + 1) % shapes.length)
    }, 1000) // Change every second

    return () => clearInterval(interval)
  }, [shapes.length])

  const currentShapeStyle = shapes[currentShape]

  return (
    <div className="relative h-[85%] w-[85%] flex items-center justify-center">
      <img 
        className="h-full w-full rounded-lg object-contain transition-all duration-1000 ease-in-out"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgrp6KMSmRyPXePpOhV-JhQxytAMwCyhCZFwxatZc6vfZn3jrw-pG2TroosOPLswxlrw56Hq6o11r2tNLPKntsAvGRhDcBASi3mNRoFqlT6cVbeB2kaAyQBnyqE_OSeMZ0mpFt_XyfFo9GJlxJQqpj6QPZTHVDlw3z5KkRtG4yw0SqLphPwP9XcB3QLKqAod6h9_6mGACYVEcPZucJuaMbTtBxnZwE-71VjZ0NrnSMMeiXoxSTbSKceauZfvXqxPI4CC-M_ULo4ak"
        alt="3D wireframe mesh of packaging design"
        style={{
          transform: currentShapeStyle.transform,
          filter: currentShapeStyle.filter,
        }}
      />
    </div>
  )
}