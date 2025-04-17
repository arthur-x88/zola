
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PopoverContent } from "@/components/ui/popover"
import React, { useState } from "react"
import { APP_NAME } from "../../../lib/config"
import { createClient } from "../../../lib/supabase/client"
import { toast } from "sonner"

export function PopoverContentAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleSignInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
      
      toast.success("Check your email for the login link!", {
        description: "We've sent a magic link to your email address."
      })
      
    } catch (err: any) {
      console.error("Error signing in with email:", err)
      setError(err.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PopoverContent
      className="w-[300px] overflow-hidden rounded-xl p-0"
      side="top"
      align="start"
    >
      <img
        src="/banner_forest.jpg"
        alt={`calm paint generate by ${APP_NAME}`}
        className="h-32 w-full object-cover"
      />
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
          {error}
        </div>
      )}
      <div className="p-3">
        <p className="text-primary mb-1 text-base font-medium">
          Login to try more features for free
        </p>
        <p className="text-muted-foreground mb-5 text-base">
          Add files, use more models, agents, and more.
        </p>
        <form onSubmit={handleSignInWithEmail} className="space-y-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="text-sm"
          />
          <Button
            type="submit"
            variant="secondary"
            className="w-full text-base"
            size="lg"
            disabled={isLoading}
          >
            <span>{isLoading ? "Sending link..." : "Continue with Email"}</span>
          </Button>
        </form>
      </div>
    </PopoverContent>
  )
}
