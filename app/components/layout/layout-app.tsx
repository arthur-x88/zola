import { cn } from "@/lib/utils"
import { ReactNode } from "react"
import { Header } from "./header"
import { GlowEffect } from "@/components/motion-primitives/glow-effect"
import { useTheme } from "next-themes"

export async function LayoutApp({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col relative",
        
      )}
    >
      {isDarkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <GlowEffect 
            className="opacity-15" 
            colors={['#4A0E5C', '#242582', '#330066', '#301934', '#191970']} 
            mode="breathe" 
            blur="strongest" 
            scale={2} 
            duration={20}
          />
        </div>
      )}
      <Header />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  )
}