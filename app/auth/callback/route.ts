import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";

// Vangt de redirect van Supabase (na Google login) op, wisselt de
// oauth "code" in voor een sessie-cookie, en stuurt de gebruiker door.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/cursussen";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Er ging iets mis (geen code, of exchange faalde) -> terug naar login.
  return NextResponse.redirect(`${origin}/login?fout=oauth`);
}
