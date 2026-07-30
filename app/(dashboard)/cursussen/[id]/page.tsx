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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-pink-600 mb-2">{course.titel}</h1>
      <p className="text-gray-600 mb-6">{course.beschrijving}</p>

      {!isIngeschreven && (
        <form action="/api/checkout" method="POST" className="mb-8">
          <input type="hidden" name="courseId" value={course.id} />
          <button
            type="submit"
            className="rounded-full bg-pink-500 px-6 py-3 text-white font-semibold hover:bg-pink-600 transition"
          >
            Schrijf je in — €{(course.prijs_cent / 100).toFixed(2)}
          </button>
        </form>
      )}

      <h2 className="font-bold mb-3">Lessen</h2>
      <ul className="divide-y divide-pink-100 rounded-xl border border-pink-100 bg-white">
        {lessons?.map((les, i) => {
          const toegankelijk = isIngeschreven || les.gratis_preview;
          const inhoud = (
            <div className="flex items-center justify-between px-4 py-3">
              <span className={toegankelijk ? "" : "text-gray-400"}>
                {i + 1}. {les.titel} {les.gratis_preview && !isIngeschreven && (
                  <span className="text-xs text-pink-500 ml-2">(gratis preview)</span>
                )}
              </span>
              <span className="text-xs text-gray-400">
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
  );
}
