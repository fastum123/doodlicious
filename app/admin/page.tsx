import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold text-pink-600 mb-6">Beheer</h1>
      <Link
        href="/admin/cursussen"
        className="rounded-full bg-pink-500 px-6 py-3 text-white font-semibold hover:bg-pink-600 transition inline-block"
      >
        Cursussen beheren
      </Link>
    </div>
  );
}
