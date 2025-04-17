import {
  AUTH_DAILY_MESSAGE_LIMIT,
  NON_AUTH_DAILY_MESSAGE_LIMIT,
} from "@/lib/config"
import { validateUserIdentity } from "../../../lib/server/api"
import { createGuestServerClient } from "@/lib/supabase/server-guest"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  const isAuthenticated = searchParams.get("isAuthenticated") === "true"
  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
    })
  }

  try {
    // For guest users, check if they exist first
    if (!isAuthenticated) {
      const supabaseAdmin = await createGuestServerClient()
      // Check if the user record already exists
      const { data: existingUser } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("id", userId)
        .eq("anonymous", true)
        .maybeSingle()

      // If guest user doesn't exist, create it
      if (!existingUser) {
        await supabaseAdmin
          .from("users")
          .insert({
            id: userId,
            email: `${userId}@anonymous.example`,
            anonymous: true,
            message_count: 0,
            daily_message_count: 0,
            daily_reset: new Date().toISOString(),
            premium: false,
            created_at: new Date().toISOString(),
          })
      }
    }

    // Now validate the user (it should exist)
    const supabase = await validateUserIdentity(userId, isAuthenticated)

    const { data, error } = await supabase
      .from("users")
      .select("daily_message_count")
      .eq("id", userId)
      .maybeSingle()

    if (error || !data) {
      return new Response(JSON.stringify({ error: error?.message }), {
        status: 500,
      })
    }

    const dailyLimit = isAuthenticated
      ? AUTH_DAILY_MESSAGE_LIMIT
      : NON_AUTH_DAILY_MESSAGE_LIMIT
    const dailyCount = data.daily_message_count || 0
    const remaining = dailyLimit - dailyCount

    return new Response(JSON.stringify({ dailyCount, dailyLimit, remaining }), {
      status: 200,
    })
  } catch (err: any) {
    console.error("Rate limit check error:", err)
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500 }
    )
  }
}
