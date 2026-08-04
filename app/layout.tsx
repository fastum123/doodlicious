import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import UserMenu from "@/components/UserMenu";

export const metadata: Metadata = {
  title: "Doodlicious | Online opleidingen voor hondentrimmers",
  description:
    "Volg professionele videocursussen voor hondentrimmers. Leer trimmen, knippen en verzorgen van elk ras, in je eigen tempo."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let naam = "";
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("volledige_naam, role")
      .eq("id", user.id)
      .single();
    naam = profile?.volledige_naam || user.email || "Account";
    isAdmin = profile?.role === "admin";
  }

  return (
    <html lang="nl">
      <body className="font-sans">
        <header className="sticky top-0 z-40 border-b border-pink-100/70 bg-white/80 backdrop-blur-lg">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-xl font-semibold text-plum-900"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-lg shadow-glow">
                🐾
              </span>
              Doodlicious
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-plum-900/80">
              <Link href="/cursussen" className="hover:text-pink-600 transition">Cursussen</Link>
              {user ? (
                <UserMenu naam={naam} isAdmin={isAdmin} />
              ) : (
                <>
                  <Link href="/login" className="hover:text-pink-600 transition">Inloggen</Link>
                  <Link
                    href="/registreren"
                    className="rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-5 py-2.5 text-white font-semibold shadow-glow hover:shadow-xl hover:-translate-y-0.5 transition"
                  >
                    Start nu
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
        <footer className="relative overflow-hidden border-t border-pink-100 bg-plum-900 py-12 mt-20 text-cream-100">
          <div className="pawprint-bg absolute inset-0 opacity-[0.06]" />
          <div className="relative mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-pink-100/80">
            <span className="font-display text-lg text-white">🐾 Doodlicious</span>
            <span>© {new Date().getFullYear()} Doodlicious — alle rechten voorbehouden</span>
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-pink-300">
                <path
                  d="M12 3l1.9 4.6L19 9l-4.1 3.6L16 18l-4-2.7L8 18l1.1-5.4L5 9l5.1-1.4L12 3z"
                  fill="currentColor"
                />
              </svg>
              Video's beveiligd, niet te downloaden of te kopiëren
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
