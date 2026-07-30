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
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="text-2xl font-bold text-pink-600 mb-6">Inloggen</h1>
      <form onSubmit={handleLogin} className="space-y-4">
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
          <label className="block text-sm font-medium mb-1">Wachtwoord</label>
          <input
            type="password"
            required
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
          {bezig ? "Bezig..." : "Inloggen"}
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        Nog geen account?{" "}
        <Link href="/registreren" className="text-pink-600 font-medium">
          Registreer hier
        </Link>
      </p>
    </div>
  );
}
