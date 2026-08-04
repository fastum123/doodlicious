import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function CursusDetailPagina({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: course } = await supabase
    .from("courses")
    .select("id, titel, beschrijving, prijs_cent")
    .eq("id", params.id)
    .single();

  if (!course) notFound();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, titel, volgorde, duur_seconden, gratis_preview")
    .eq("course_id", params.id)
    .order("volgorde");

  let isIngeschreven = false;
  if (user) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", params.id)
      .maybeSingle();
    isIngeschreven = !!enrollment;
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="bg-gradient-to-br from-pink-100 via-pink-50 to-cream-50 border-b border-pink-100">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-plum-900 mb-3">
            {course.titel}
          </h1>
          <p className="text-plum-900/60 mb-8 max-w-2xl">{course.beschrijving}</p>

          {!isIngeschreven ? (
            <form action="/api/checkout" method="POST">
              <input type="hidden" name="courseId" value={course.id} />
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-7 py-3.5 text-white font-semibold shadow-glow hover:-translate-y-0.5 hover:shadow-xl transition"
              >
                Schrijf je in — €{(course.prijs_cent / 100).toFixed(2)}
              </button>
            </form>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-pink-600 border border-pink-200">
              ✓ Je bent ingeschreven voor deze cursus
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="font-display font-semibold text-xl text-plum-900 mb-4">Lessen</h2>
        <ul className="divide-y divide-pink-100 rounded-2xl border border-pink-100 bg-white shadow-card overflow-hidden">
          {lessons?.map((les, i) => {
            const toegankelijk = isIngeschreven || les.gratis_preview;
            const inhoud = (
              <div className="flex items-center justify-between px-5 py-4 hover:bg-pink-50/60 transition">
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                      toegankelijk ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={toegankelijk ? "text-plum-900" : "text-gray-400"}>
                    {les.titel}
                  </span>
                  {les.gratis_preview && !isIngeschreven && (
                    <span className="text-xs rounded-full bg-pink-50 text-pink-500 px-2 py-0.5">
                      gratis preview
                    </span>
                  )}
                </span>
                <span className="text-xs text-plum-900/40">
                  {toegankelijk ? "▶︎ Bekijk" : "🔒"}
                </span>
              </div>
            );
            return (
              <li key={les.id}>
                {toegankelijk ? (
                  <Link href={`/cursussen/${course.id}/les/${les.id}`}>{inhoud}</Link>
                ) : (
                  inhoud
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
