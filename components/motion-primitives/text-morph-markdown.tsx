
"use client"

import { useState, useEffect } from "react"
import { TextMorph, TextMorphProps } from "./text-morph"
import { marked } from "marked"
import DOMPurify from "dompurify"

interface TextMorphMarkdownProps extends Omit<TextMorphProps, "children"> {
  children: string
  className?: string
}

export function TextMorphMarkdown({
  children,
  className,
  ...props
}: TextMorphMarkdownProps) {
  const [plainText, setPlainText] = useState("")
  
  // Convert markdown to plain text for animation
  useEffect(() => {
    if (typeof window !== "undefined" && children) {
      try {
        // Create a temporary div
        const tempDiv = document.createElement("div")
        // Parse markdown to HTML
        const html = marked.parse(children)
        // Sanitize HTML
        const sanitizedHtml = DOMPurify.sanitize(html)
        // Set HTML content
        tempDiv.innerHTML = sanitizedHtml
        // Extract text content
        const extractedText = tempDiv.textContent || ""
        setPlainText(extractedText)
      } catch (error) {
        console.error("Error converting markdown:", error)
        setPlainText(children)
      }
    }
  }, [children])

  return (
    <TextMorph className={className} {...props}>
      {plainText || children}
    </TextMorph>
  )
}
