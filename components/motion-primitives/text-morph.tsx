"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion, Transition, Variants } from "motion/react"
import { useId, useMemo } from "react"

export type TextMorphProps = {
  children: string
  as?: React.ElementType
  className?: string
  style?: React.CSSProperties
  variants?: Variants
  transition?: Transition
  preserveEmojis?: boolean
}

export function TextMorph({
  children,
  as: Component = "p",
  className,
  style,
  variants,
  transition,
  preserveEmojis = false,
}: TextMorphProps) {
  const uniqueId = useId()

  const characters = useMemo(() => {
    const charCounts: Record<string, number> = {}

    // Emoji regex pattern
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu
    
    if (preserveEmojis) {
      // Split text by emoji and non-emoji parts
      const parts: string[] = []
      let lastIndex = 0
      let match
      
      // Find all emojis in the text
      while ((match = emojiRegex.exec(children)) !== null) {
        // Add text before emoji
        if (match.index > lastIndex) {
          parts.push(children.substring(lastIndex, match.index))
        }
        // Add emoji as a single unit
        parts.push(match[0])
        lastIndex = match.index + match[0].length
      }
      
      // Add remaining text
      if (lastIndex < children.length) {
        parts.push(children.substring(lastIndex))
      }
      
      // Process each part
      return parts.flatMap((part, partIndex) => {
        // If part is an emoji, treat it as one character
        if (part.match(emojiRegex)) {
          return [{
            id: `${uniqueId}-emoji-${partIndex}`,
            label: part,
          }]
        }
        
        // Otherwise split into individual characters
        return part.split("").map((char, charIndex) => {
          const lowerChar = char.toLowerCase()
          const key = `${lowerChar}-${partIndex}-${charIndex}`
          charCounts[key] = (charCounts[key] || 0) + 1
          
          return {
            id: `${uniqueId}-${key}${charCounts[key]}`,
            label: char === " " ? "\u00A0" : char,
          }
        })
      })
    }
    
    // Original behavior for non-emoji preservation
    return children.split("").map((char) => {
      const lowerChar = char.toLowerCase()
      charCounts[lowerChar] = (charCounts[lowerChar] || 0) + 1

      return {
        id: `${uniqueId}-${lowerChar}${charCounts[lowerChar]}`,
        label: char === " " ? "\u00A0" : char,
      }
    })
  }, [children, uniqueId, preserveEmojis])

  const defaultVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const defaultTransition: Transition = {
    type: "spring",
    stiffness: 280,
    damping: 18,
    mass: 0.3,
  }

  return (
    <Component className={cn(className)} aria-label={children} style={style}>
      <AnimatePresence mode="popLayout" initial={false}>
        {characters.map((character) => (
          <motion.span
            key={character.id}
            layoutId={character.id}
            className="inline-block"
            aria-hidden="true"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants || defaultVariants}
            transition={transition || defaultTransition}
          >
            {character.label}
          </motion.span>
        ))}
      </AnimatePresence>
    </Component>
  )
}
