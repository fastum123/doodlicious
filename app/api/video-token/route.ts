import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { maakSignedStreamToken } from "@/lib/cloudflare-stream";

// Geeft alleen een kortlevend, getekend video-token terug als de ingelogde
// gebruiker daadwerkelijk toegang heeft (ingeschreven of gratis preview).
// De echte Cloudflare video-UID komt NOOIT in de browser terecht.
export async function GET(req: NextRequest) {
  const lessonId = req.nextUrl.searchParams.get("lessonId");
  if (!lessonId) return NextResponse.json({ error: "lessonId ontbreekt" }, { status: 400 });

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: les } = await supabase
    .from("lessons")
    .select("id, cloudflare_video_uid, gratis_preview, course_id")
    .eq("id", lessonId)
    .single();

  if (!les) return NextResponse.json({ error: "Les niet gevonden" }, { status: 404 });

  let magBekijken = les.gratis_preview;
  if (!magBekijken) {
    if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", les.course_id)
      .maybeSingle();
    magBekijken = !!enrollment;
  }

  if (!magBekijken) {
    return NextResponse.json({ error: "Geen toegang tot deze les" }, { status: 403 });
  }

  const { iframeUrl } = maakSignedStreamToken(les.cloudflare_video_uid);
  return NextResponse.json({ iframeUrl });
}
