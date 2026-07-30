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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-pink-600 mb-8">Cursussen</h1>
      {!courses?.length && (
        <p className="text-gray-500">Er zijn nog geen cursussen gepubliceerd.</p>
      )}
      <div className="grid md:grid-cols-3 gap-6">
        {courses?.map((course) => {
          const isIngeschreven = ingeschrevenIds.has(course.id);
          return (
            <Link
              key={course.id}
              href={`/cursussen/${course.id}`}
              className="rounded-2xl border border-pink-100 overflow-hidden bg-white hover:shadow-lg hover:shadow-pink-100 transition"
            >
              <div className="h-40 bg-pink-100 flex items-center justify-center text-4xl">🐩</div>
              <div className="p-4">
                <h2 className="font-bold mb-1">{course.titel}</h2>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{course.beschrijving}</p>
                <div className="flex items-center justify-between">
                  <span className="text-pink-600 font-semibold">
                    {isIngeschreven ? "Ingeschreven" : `€${(course.prijs_cent / 100).toFixed(2)}`}
                  </span>
                  <span className="text-xs text-gray-400">
                    {isIngeschreven ? "Ga verder →" : "Bekijk cursus →"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
