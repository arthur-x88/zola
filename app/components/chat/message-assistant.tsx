import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/prompt-kit/message"
import { TextEffect } from "@/components/motion-primitives/text-effect"
import { cn } from "@/lib/utils"
import { ArrowClockwise, Check, Copy } from "@phosphor-icons/react"
import { useMemo, useState, useEffect } from "react"

type MessageAssistantProps = {
  children: string
  isLast?: boolean
  hasScrollAnchor?: boolean
  copied?: boolean
  copyToClipboard?: () => void
  onReload?: () => void
  status?: "streaming" | "ready" | "submitted" | "error"
}

export function MessageAssistant({
  children,
  isLast,
  hasScrollAnchor,
  copied,
  copyToClipboard,
  onReload,
  status,
}: MessageAssistantProps) {
  // Track when animation should be shown - only animate the last message when it's streaming
  const shouldAnimate = isLast && status === "streaming"
  const [showAnimation, setShowAnimation] = useState(false)
  
  // Animation variants for character-by-character animation that better simulates typing
  const textAnimationVariants = useMemo(() => ({
    container: {
      hidden: { opacity: 1 }, // Start container visible to avoid flash
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.015, // Slightly slower for more natural typing feel
          delayChildren: 0,      // No delay before starting
        }
      },
    },
    item: {
      hidden: { opacity: 0, y: 0 }, // Just hide the character, no vertical offset
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          type: "tween",         // Use tween for more consistent typing effect
          duration: 0.05,        // Very quick transition per character
          ease: "easeOut",
        }
      },
    }
  }), [])

  // Show animation immediately for streaming content
  useEffect(() => {
    if (shouldAnimate && children) {
      setShowAnimation(true)
    }
  }, [shouldAnimate, children])

  return (
    <Message
      className={cn(
        "group flex w-full max-w-3xl flex-1 items-start gap-4 px-6 pb-2",
        hasScrollAnchor && "min-h-scroll-anchor"
      )}
    >
      <div className={cn("flex min-w-full flex-col gap-2", isLast && "pb-8")}>
        {shouldAnimate && showAnimation ? (
          <div className="prose dark:prose-invert prose-p:text-[16px] prose-p:leading-[1.7] prose-p:font-normal prose-p:text-[#253b22] relative min-w-full bg-transparent p-0">
            <TextEffect
              per="char"
              preset="fade"
              variants={textAnimationVariants}
              speedReveal={1.0}
              speedSegment={1.0}
              delay={0}
              className="block whitespace-pre-wrap"
              trigger={true} // Ensure animation starts immediately
            >
              {children}
            </TextEffect>
          </div>
        ) : (
          <MessageContent
            className="prose dark:prose-invert prose-p:text-[16px] prose-p:leading-[1.7] prose-p:font-normal prose-p:text-[#253b22] relative min-w-full bg-transparent p-0"
            markdown={true}
          >
            {children}
          </MessageContent>
        )}

        <MessageActions
          className={cn(
            "flex gap-0 opacity-0 transition-opacity group-hover:opacity-100"
          )}
        >
          <MessageAction
            tooltip={copied ? "Copied!" : "Copy text"}
            side="bottom"
            delayDuration={0}
          >
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent transition"
              aria-label="Copy text"
              onClick={copyToClipboard}
              type="button"
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
          </MessageAction>
          <MessageAction tooltip="Regenerate" side="bottom" delayDuration={0}>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent transition"
              aria-label="Regenerate"
              onClick={onReload}
              type="button"
            >
              <ArrowClockwise className="size-4" />
            </button>
          </MessageAction>
        </MessageActions>
      </div>
    </Message>
  )
}
