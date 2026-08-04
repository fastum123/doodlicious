"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function RegistrerenPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [naam, setNaam] = useState("");
  const [foutmelding, setFoutmelding] = useState<string | null>(null);
  const [gelukt, setGelukt] = useState(false);
  const [bezig, setBezig] = useState(false);

  async function handleRegistreren(e: React.FormEvent) {
    e.preventDefault();
    setBezig(true);
    setFoutmelding(null);
    const { error } = await supabase.auth.signUp({
      email,
      password: wachtwoord,
      options: {
        data: { volledige_naam: naam },
        // Forceert dat de bevestigingslink altijd teruggaat naar déze site,
        // ongeacht wat er in de Supabase Site URL-instelling staat.
        emailRedirectTo: `${window.location.origin}/login`
      }
    });
    setBezig(false);
    if (error) {
      setFoutmelding(error.message);
      return;
    }
    setGelukt(true);
  }

  if (gelukt) {
    return (
      <div className="min-h-[80vh] bg-hero-gradient flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-3xl bg-white shadow-glow border border-pink-100 p-8 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-3xl mb-4">
            ✉️
          </span>
          <h1 className="font-display text-2xl font-semibold text-plum-900 mb-2">Bijna klaar!</h1>
          <p className="text-plum-900/60">
            Check je e-mail en bevestig je account om in te loggen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-hero-gradient flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-glow border border-pink-100 p-8">
        <div className="text-center mb-8">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-2xl mb-4 shadow-glow">
            🐾
          </span>
          <h1 className="font-display text-2xl font-semibold text-plum-900">Account aanmaken</h1>
          <p className="text-sm text-plum-900/50 mt-1">Start vandaag nog met leren</p>
        </div>
        <form onSubmit={handleRegistreren} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-plum-900/80">Naam</label>
            <input
              type="text"
              required
              value={naam}
              onChange={(e) => setNaam(e.target.value)}
              className="w-full rounded-xl border border-pink-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-plum-900/80">E-mailadres</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-pink-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-plum-900/80">
              Wachtwoord (min. 8 tekens)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={wachtwoord}
              onChange={(e) => setWachtwoord(e.target.value)}
              className="w-full rounded-xl border border-pink-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>
          {foutmelding && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{foutmelding}</p>
          )}
          <button
            type="submit"
            disabled={bezig}
            className="w-full rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-4 py-3 text-white font-semibold shadow-glow hover:-translate-y-0.5 hover:shadow-xl transition disabled:opacity-50 disabled:translate-y-0"
          >
            {bezig ? "Bezig..." : "Account aanmaken"}
          </button>
        </form>
      </div>
    </div>
  );
}
