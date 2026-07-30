"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function NieuweCursusForm() {
  const supabase = createClient();
  const router = useRouter();
  const [titel, setTitel] = useState("");
  const [beschrijving, setBeschrijving] = useState("");
  const [prijs, setPrijs] = useState("");
  const [bezig, setBezig] = useState(false);
  const [foutmelding, setFoutmelding] = useState<string | null>(null);

  async function opslaan(e: React.FormEvent) {
    e.preventDefault();
    setBezig(true);
    setFoutmelding(null);
    const { error } = await supabase.from("courses").insert({
      titel,
      beschrijving,
      prijs_cent: Math.round(parseFloat(prijs || "0") * 100),
      gepubliceerd: false
    });
    setBezig(false);
    if (error) {
      setFoutmelding(error.message);
      return;
    }
    setTitel("");
    setBeschrijving("");
    setPrijs("");
    router.refresh();
  }

  return (
    <form onSubmit={opslaan} className="space-y-3 bg-white border border-pink-100 rounded-xl p-4">
      <input
        placeholder="Titel"
        value={titel}
        onChange={(e) => setTitel(e.target.value)}
        required
        className="w-full rounded-lg border border-pink-200 px-3 py-2"
      />
      <textarea
        placeholder="Beschrijving"
        value={beschrijving}
        onChange={(e) => setBeschrijving(e.target.value)}
        className="w-full rounded-lg border border-pink-200 px-3 py-2"
      />
      <input
        placeholder="Prijs in euro's, bv. 49.00"
        value={prijs}
        onChange={(e) => setPrijs(e.target.value)}
        required
        className="w-full rounded-lg border border-pink-200 px-3 py-2"
      />
      {foutmelding && <p className="text-sm text-red-600">{foutmelding}</p>}
      <button
        disabled={bezig}
        className="rounded-full bg-pink-500 px-5 py-2 text-white font-semibold hover:bg-pink-600 transition disabled:opacity-50"
      >
        {bezig ? "Bezig..." : "Cursus toevoegen"}
      </button>
    </form>
  );
}
