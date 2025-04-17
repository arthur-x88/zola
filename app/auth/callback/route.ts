import { MODEL_DEFAULT } from "@/lib/config"
import { createClient } from "@/lib/supabase/server"
import { createGuestServerClient } from "@/lib/supabase/server-guest"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent("Missing authentication code")}`
    )
  }

  const supabase = await createClient()
  const supabaseAdmin = await createGuestServerClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("Auth error:", error)
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent(error.message)}`
    )
  }

  const user = data?.user
  if (!user || !user.id || !user.email) {
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent("Missing user info")}`
    )
  }

  try {
    // Try to insert user only if not exists
    const { error: insertError } = await supabaseAdmin.from("users").insert({
      id: user.id,
      email: user.email,
      created_at: new Date().toISOString(),
      message_count: 0,
      premium: false,
      preferred_model: MODEL_DEFAULT,
    })

    if (insertError && insertError.code !== "23505") {
      console.error("Error inserting user:", insertError)
    }
  } catch (err) {
    console.error("Unexpected user insert error:", err)
  }

  // Get the host from headers
  const forwardedHost = request.headers.get("x-forwarded-host")
  const host = request.headers.get("host")
  
  // Determine the base URL to use for redirection
  let baseUrl
  if (process.env.NODE_ENV === "development") {
    // In development
    baseUrl = origin
  } else if (forwardedHost) {
    // In production with forwarded host header (e.g., from a proxy)
    baseUrl = `https://${forwardedHost}`
  } else if (host) {
    // Fallback to the host header
    baseUrl = `https://${host}`
  } else {
    // Last resort fallback to origin
    baseUrl = origin
  }

  const redirectUrl = `${baseUrl}${next}`

  return NextResponse.redirect(redirectUrl)
}
