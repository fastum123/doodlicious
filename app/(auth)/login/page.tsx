"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const supabase = createClient();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [foutmelding, setFoutmelding] = useState<string | null>(null);
  const [bezig, setBezig] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBezig(true);
    setFoutmelding(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password: wachtwoord });
    if (error) {
      setBezig(false);
      setFoutmelding("E-mailadres of wachtwoord is onjuist.");
      return;
    }
    // Volledige paginaherlading (i.p.v. router.push) zodat het net gezette
    // sessie-cookie zeker meegaat naar de server voordat de middleware checkt.
    window.location.href = params.get("volgende") || "/cursussen";
  }

  async function handleGoogleLogin() {
    setFoutmelding(null);
    const next = params.get("volgende") || "/cursussen";
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      }
    });
    // Supabase stuurt de browser hierna zelf door naar Google, dus er hoeft
    // hier verder niets te gebeuren.
  }

  return (
    <div className="min-h-[80vh] bg-hero-gradient flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-glow border border-pink-100 p-8">
        <div className="text-center mb-8">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-2xl mb-4 shadow-glow">
            🐾
          </span>
          <h1 className="font-display text-2xl font-semibold text-plum-900">Welkom terug</h1>
          <p className="text-sm text-plum-900/50 mt-1">Log in om verder te gaan met leren</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
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
            <label className="block text-sm font-medium mb-1 text-plum-900/80">Wachtwoord</label>
            <input
              type="password"
              required
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
            {bezig ? "Bezig..." : "Inloggen"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <span className="h-px flex-1 bg-pink-100" />
          <span className="text-xs uppercase tracking-wide text-plum-900/40">of</span>
          <span className="h-px flex-1 bg-pink-100" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 rounded-full border border-pink-200 px-4 py-2.5 text-sm font-semibold text-plum-900/80 hover:bg-pink-50 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.89c2.28-2.1 3.56-5.2 3.56-8.82z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.89-3c-1.08.73-2.47 1.15-4.06 1.15-3.12 0-5.77-2.1-6.72-4.93H1.27v3.1A12 12 0 0 0 12 24z" />
            <path fill="#FBBC05" d="M5.28 14.31A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.58.38-2.31v-3.1H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.41z" />
            <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.59l4.01 3.1C6.23 6.86 8.88 4.77 12 4.77z" />
          </svg>
          Inloggen met Google
        </button>

        <p className="text-sm text-plum-900/50 mt-6 text-center">
          Nog geen account?{" "}
          <Link href="/registreren" className="text-pink-600 font-semibold">
            Registreer hier
          </Link>
        </p>
      </div>
    </div>
  );
}
