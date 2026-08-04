"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
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
    setBezig(false);
    if (error) {
      setFoutmelding("E-mailadres of wachtwoord is onjuist.");
      return;
    }
    router.push(params.get("volgende") || "/cursussen");
    router.refresh();
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
