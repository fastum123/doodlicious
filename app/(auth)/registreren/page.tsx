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
      options: { data: { volledige_naam: naam } }
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
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-pink-600 mb-4">Bijna klaar!</h1>
        <p className="text-gray-600">
          Check je e-mail en bevestig je account om in te loggen.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="text-2xl font-bold text-pink-600 mb-6">Account aanmaken</h1>
      <form onSubmit={handleRegistreren} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Naam</label>
          <input
            type="text"
            required
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            className="w-full rounded-lg border border-pink-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">E-mailadres</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-pink-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Wachtwoord (min. 8 tekens)</label>
          <input
            type="password"
            required
            minLength={8}
            value={wachtwoord}
            onChange={(e) => setWachtwoord(e.target.value)}
            className="w-full rounded-lg border border-pink-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
        {foutmelding && <p className="text-sm text-red-600">{foutmelding}</p>}
        <button
          type="submit"
          disabled={bezig}
          className="w-full rounded-full bg-pink-500 px-4 py-2 text-white font-semibold hover:bg-pink-600 transition disabled:opacity-50"
        >
          {bezig ? "Bezig..." : "Account aanmaken"}
        </button>
      </form>
    </div>
  );
}
