import { createClient } from "@/lib/supabase-server";
import NieuweCursusForm from "./NieuweCursusForm";

export default async function AdminCursussenPagina() {
  const supabase = createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, titel, prijs_cent, gepubliceerd")
    .order("created_at", { ascending: false });

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-xs font-semibold text-pink-600 mb-3">
            🛠️ Beheer
          </span>
          <h1 className="font-display text-3xl font-semibold text-plum-900">Cursussen beheren</h1>
        </div>

        <NieuweCursusForm />

        <h2 className="font-display font-semibold text-lg text-plum-900 mt-10 mb-3">
          Bestaande cursussen
        </h2>
        <ul className="divide-y divide-pink-100 rounded-2xl border border-pink-100 bg-white shadow-card overflow-hidden">
          {courses?.map((c) => (
            <li key={c.id} className="flex items-center justify-between px-5 py-4">
              <span className="font-medium text-plum-900">{c.titel}</span>
              <span className="flex items-center gap-3 text-sm">
                <span className="text-plum-900/60">€{(c.prijs_cent / 100).toFixed(2)}</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    c.gepubliceerd
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {c.gepubliceerd ? "Gepubliceerd" : "Concept"}
                </span>
              </span>
            </li>
          ))}
          {!courses?.length && (
            <li className="px-5 py-8 text-center text-sm text-plum-900/40">
              Nog geen cursussen aangemaakt.
            </li>
          )}
        </ul>

        <p className="text-sm text-plum-900/50 mt-6 bg-white border border-pink-100 rounded-xl p-4">
          Video's uploaden doe je rechtstreeks in het{" "}
          <a
            href="https://dash.cloudflare.com/?to=/:account/stream"
            target="_blank"
            className="text-pink-600 underline"
          >
            Cloudflare Stream dashboard
          </a>
          . Kopieer daarna de video-UID hierheen om een les toe te voegen (les-beheer per
          cursus volgt dezelfde vorm als hierboven — uit te breiden naar wens).
        </p>
      </div>
    </div>
  );
}
