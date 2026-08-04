import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import VideoPlayer from "@/components/VideoPlayer";

export default async function LesPagina({
  params
}: {
  params: { id: string; lesId: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: les } = await supabase
    .from("lessons")
    .select("id, titel, gratis_preview, course_id")
    .eq("id", params.lesId)
    .single();

  if (!les) notFound();

  let magBekijken = les.gratis_preview;
  if (!magBekijken && user) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", les.course_id)
      .maybeSingle();
    magBekijken = !!enrollment;
  }

  if (!magBekijken) {
    return (
      <div className="bg-cream-50 min-h-[80vh] flex items-center justify-center px-4 py-20 text-center">
        <div>
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-3xl mb-4">
            🔒
          </span>
          <h1 className="font-display text-2xl font-semibold text-plum-900 mb-3">Geen toegang</h1>
          <p className="text-plum-900/60">Schrijf je in voor deze cursus om deze les te bekijken.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-2xl font-semibold text-plum-900 mb-6">{les.titel}</h1>
        <VideoPlayer lessonId={les.id} />
      </div>
    </div>
  );
}
