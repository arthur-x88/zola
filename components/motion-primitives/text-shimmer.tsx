
"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface TextShimmerProps {
  text?: string
  children?: React.ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
  duration?: number
  spread?: number
}

export function TextShimmer({ 
  text, 
  children, 
  className, 
  as = "span",
  duration = 2,
  spread = 2
}: TextShimmerProps) {
  const Component = as
  const content = text || children
  
  return (
    <Component
      className={cn(
        "bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] bg-clip-text text-transparent",
        `animate-[shimmer_${duration}s_ease-in-out_infinite]`,
        className
      )}
      style={{
        backgroundSize: `${spread * 100}% 100%`,
      }}
    >
      {content}
    </Component>
  )
}
