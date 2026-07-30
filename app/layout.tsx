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
      <body>
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-pink-100">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-pink-600">
              🐾 Doodlicious
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link href="/cursussen" className="hover:text-pink-600">Cursussen</Link>
              {user ? (
                <UserMenu naam={naam} isAdmin={isAdmin} />
              ) : (
                <>
                  <Link href="/login" className="hover:text-pink-600">Inloggen</Link>
                  <Link
                    href="/registreren"
                    className="rounded-full bg-pink-500 px-4 py-2 text-white hover:bg-pink-600 transition"
                  >
                    Start nu
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-pink-100 bg-white py-8 mt-20">
          <div className="mx-auto max-w-6xl px-4 text-sm text-gray-500 flex justify-between">
            <span>© {new Date().getFullYear()} Doodlicious</span>
            <span>Alle video's zijn beveiligd en niet te downloaden of te kopiëren.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
