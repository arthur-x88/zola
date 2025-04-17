import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/prompt-kit/message"
// Text morph markdown import removed
import { cn } from "@/lib/utils"
import { ArrowClockwise, Check, Copy } from "@phosphor-icons/react"
import { useMemo } from "react"

type MessageAssistantProps = {
  children: string
  isLast?: boolean
  hasScrollAnchor?: boolean
  copied?: boolean
  copyToClipboard?: () => void
  onReload?: () => void
}

export function MessageAssistant({
  children,
  isLast,
  hasScrollAnchor,
  copied,
  copyToClipboard,
  onReload,
}: MessageAssistantProps) {
  // Use animation for the last message (which is typically streaming)
  const shouldAnimate = isLast
  
  // Create custom variants for the text animation
  const textAnimationVariants = useMemo(() => ({
    initial: { opacity: 0, y: 3 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 }
  }), [])
  
  // Custom transition for smooth character animation
  const textAnimationTransition = useMemo(() => ({
    type: "spring",
    stiffness: 320,
    damping: 25,
    mass: 0.2,
    staggerChildren: 0.01,
    delayChildren: 0.005
  }), [])

  return (
    <Message
      className={cn(
        "group flex w-full max-w-3xl flex-1 items-start gap-4 px-6 pb-2",
        hasScrollAnchor && "min-h-scroll-anchor"
      )}
    >
      <div className={cn("flex min-w-full flex-col gap-2", isLast && "pb-8")}>
        {(
          <MessageContent
            className="prose dark:prose-invert prose-p:text-[15px] prose-p:leading-[1.6] prose-p:font-medium prose-p:text-[#253b22] relative min-w-full bg-transparent p-0"
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
