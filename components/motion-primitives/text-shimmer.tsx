
"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface TextShimmerProps {
  text: string
  className?: string
}

export function TextShimmer({ text, className }: TextShimmerProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] bg-clip-text text-transparent",
        "animate-[shimmer_2s_ease-in-out_infinite]",
        className
      )}
    >
      {text}
    </span>
  )
}
