
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { APP_NAME } from "@/lib/config"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useState } from "react"
import { HeaderGoBack } from "../components/header-go-back"
import { toast } from "sonner"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  async function handleSignInWithEmail(e: React.FormEvent) {
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
    <div className="bg-background flex h-screen flex-col">
      <HeaderGoBack href="/" />

      <main className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-foreground text-3xl font-medium tracking-tight sm:text-4xl">
              Welcome to {APP_NAME}
            </h1>
            <p className="text-muted-foreground mt-3">
              Sign in below to increase your message limits.
            </p>
          </div>
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
              {error}
            </div>
          )}
          <div className="mt-8">
            <form onSubmit={handleSignInWithEmail} className="space-y-4">
              <div>
                <label htmlFor="email" className="text-muted-foreground block text-sm font-medium mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="text-base"
                />
              </div>
              <Button
                type="submit"
                variant="secondary"
                className="w-full text-base sm:text-base"
                size="lg"
                disabled={isLoading}
              >
                <span>
                  {isLoading ? "Sending link..." : "Continue with Email"}
                </span>
              </Button>
            </form>
          </div>
        </div>
      </main>

      <footer className="text-muted-foreground py-6 text-center text-sm">
        <p>
          By continuing, you agree to our{" "}
          <Link href="/" className="text-foreground hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/" className="text-foreground hover:underline">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  )
}
