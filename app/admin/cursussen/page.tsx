import { createClient } from "@/lib/supabase-server";
import NieuweCursusForm from "./NieuweCursusForm";

export default async function AdminCursussenPagina() {
  const supabase = createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, titel, prijs_cent, gepubliceerd")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold text-pink-600 mb-6">Cursussen beheren</h1>

      <NieuweCursusForm />

      <h2 className="font-bold mt-10 mb-3">Bestaande cursussen</h2>
      <ul className="divide-y divide-pink-100 rounded-xl border border-pink-100 bg-white">
        {courses?.map((c) => (
          <li key={c.id} className="flex items-center justify-between px-4 py-3">
            <span>{c.titel}</span>
            <span className="text-sm text-gray-500">
              €{(c.prijs_cent / 100).toFixed(2)} · {c.gepubliceerd ? "Gepubliceerd" : "Concept"}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-sm text-gray-500 mt-6">
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
  );
}
