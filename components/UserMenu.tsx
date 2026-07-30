"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

export default function UserMenu({
  naam,
  isAdmin
}: {
  naam: string;
  isAdmin: boolean;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function buitenKlik(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", buitenKlik);
    return () => document.removeEventListener("mousedown", buitenKlik);
  }, []);

  async function uitloggen() {
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const initiaal = naam?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-pink-200 pl-1 pr-3 py-1 hover:bg-pink-50 transition"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-500 text-white text-sm font-semibold">
          {initiaal}
        </span>
        <span className="text-sm font-medium max-w-[10rem] truncate">{naam}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-pink-100 bg-white shadow-lg py-1 text-sm">
          <Link
            href="/cursussen"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 hover:bg-pink-50"
          >
            Mijn cursussen
          </Link>
          {isAdmin && (
            <Link
              href="/admin/cursussen"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 hover:bg-pink-50"
            >
              Beheer
            </Link>
          )}
          <button
            onClick={uitloggen}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-pink-50"
          >
            Uitloggen
          </button>
        </div>
      )}
    </div>
  );
}
