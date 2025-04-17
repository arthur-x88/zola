
"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface TextShimmerProps {
  children: React.ReactNode
  className?: string
}

export function TextShimmer({ children, className }: TextShimmerProps) {
  return (
    <span
      className={cn(
        "inline-flex bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer",
        className
      )}
      style={{
        // These can be overridden with CSS variables
        "--base-color": "hsl(var(--primary))",
        "--base-gradient-color": "hsl(var(--muted-foreground))"
      } as React.CSSProperties}
    >
      {children}
    </span>
  )
}
