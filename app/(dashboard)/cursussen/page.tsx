import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export default async function CursussenPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, titel, beschrijving, prijs_cent, afbeelding_url")
    .eq("gepubliceerd", true)
    .order("created_at", { ascending: false });

  const { data: inschrijvingen } = user
    ? await supabase.from("enrollments").select("course_id").eq("user_id", user.id)
    : { data: [] as { course_id: string }[] };

  const ingeschrevenIds = new Set((inschrijvingen ?? []).map((i) => i.course_id));

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-xs font-semibold text-pink-600 mb-4">
            🐾 Cursusaanbod
          </span>
          <h1 className="font-display text-4xl font-semibold text-plum-900 mb-3">Cursussen</h1>
          <p className="text-plum-900/60 max-w-xl mx-auto">
            Kies een cursus en start meteen met leren, in je eigen tempo.
          </p>
        </div>

        {!courses?.length && (
          <p className="text-center text-plum-900/50">Er zijn nog geen cursussen gepubliceerd.</p>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {courses?.map((course) => {
            const isIngeschreven = ingeschrevenIds.has(course.id);
            return (
              <Link
                key={course.id}
                href={`/cursussen/${course.id}`}
                className="group rounded-2xl border border-pink-100 overflow-hidden bg-white shadow-card hover:-translate-y-1 hover:shadow-glow transition"
              >
                <div className="h-40 bg-gradient-to-br from-pink-200 via-pink-100 to-cream-100 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                  🐩
                </div>
                <div className="p-5">
                  <h2 className="font-display font-semibold text-lg text-plum-900 mb-1">{course.titel}</h2>
                  <p className="text-sm text-plum-900/55 line-clamp-2 mb-4">{course.beschrijving}</p>
                  <div className="flex items-center justify-between">
                    {isIngeschreven ? (
                      <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
                        ✓ Ingeschreven
                      </span>
                    ) : (
                      <span className="text-pink-600 font-semibold">
                        €{(course.prijs_cent / 100).toFixed(2)}
                      </span>
                    )}
                    <span className="text-xs font-medium text-plum-900/40 group-hover:text-pink-600 transition">
                      {isIngeschreven ? "Ga verder →" : "Bekijk cursus →"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
