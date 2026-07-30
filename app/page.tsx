import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-600 mb-6">
          Word een gecertificeerd hondentrimmer
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Praktische videocursussen van ervaren trimmers. Leer rasspecifieke
          knipstijlen, gedragskennis en trimtechnieken — in je eigen tempo,
          waar en wanneer je wilt.
        </p>
        <Link
          href="/cursussen"
          className="inline-block rounded-full bg-pink-500 px-8 py-4 text-white font-semibold hover:bg-pink-600 transition shadow-lg shadow-pink-200"
        >
          Bekijk cursussen
        </Link>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-8">
          {[
            { titel: "Beveiligde video's", tekst: "Onze lessen zijn versleuteld gestreamd en niet te downloaden of kopiëren." },
            { titel: "Leer in je eigen tempo", tekst: "Volg lessen wanneer het jou uitkomt, op elk apparaat." },
            { titel: "Door professionals gemaakt", tekst: "Cursussen ontwikkeld door ervaren, gecertificeerde hondentrimmers." }
          ].map((item) => (
            <div key={item.titel} className="rounded-2xl border border-pink-100 p-6">
              <h3 className="font-bold text-pink-600 mb-2">{item.titel}</h3>
              <p className="text-gray-600 text-sm">{item.tekst}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
