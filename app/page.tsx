import Link from "next/link";

const features = [
  {
    icon: "🔒",
    titel: "Beveiligde video's",
    tekst: "Onze lessen zijn versleuteld gestreamd en niet te downloaden of kopiëren."
  },
  {
    icon: "🐩",
    titel: "Leer in je eigen tempo",
    tekst: "Volg lessen wanneer het jou uitkomt, op elk apparaat."
  },
  {
    icon: "🎓",
    titel: "Door professionals gemaakt",
    tekst: "Cursussen ontwikkeld door ervaren, gecertificeerde hondentrimmers."
  }
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-pink-200/50 blur-3xl animate-float" />
        <div className="absolute top-40 -left-20 h-64 w-64 rounded-full bg-pink-300/30 blur-3xl animate-float [animation-delay:2s]" />

        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-pink-200 px-4 py-1.5 text-xs font-semibold text-pink-600 shadow-sm mb-6">
            🐾 Voor beginners en gevorderden
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-plum-900 mb-6 leading-tight">
            Word een <span className="gradient-text">gecertificeerd</span>
            <br />
            hondentrimmer
          </h1>
          <p className="text-lg text-plum-900/70 max-w-2xl mx-auto mb-10">
            Praktische videocursussen van ervaren trimmers. Leer rasspecifieke
            knipstijlen, gedragskennis en trimtechnieken — in je eigen tempo,
            waar en wanneer je wilt.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/cursussen"
              className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-8 py-4 text-white font-semibold shadow-glow hover:-translate-y-0.5 hover:shadow-xl transition"
            >
              Bekijk cursussen
            </Link>
            <Link
              href="/registreren"
              className="inline-block rounded-full bg-white px-8 py-4 text-plum-900 font-semibold border border-pink-200 hover:border-pink-400 transition"
            >
              Gratis account maken
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl font-semibold text-plum-900 mb-3">
              Waarom Doodlicious?
            </h2>
            <p className="text-plum-900/60 max-w-xl mx-auto">
              Alles wat je nodig hebt om vol vertrouwen aan de slag te gaan als hondentrimmer.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((item) => (
              <div
                key={item.titel}
                className="group rounded-2xl border border-pink-100 p-7 shadow-card hover:-translate-y-1 hover:shadow-glow transition"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-2xl group-hover:bg-pink-100 transition">
                  {item.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-plum-900 mb-2">{item.titel}</h3>
                <p className="text-plum-900/60 text-sm leading-relaxed">{item.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-3xl font-semibold text-plum-900 mb-4">
            Klaar om te starten?
          </h2>
          <p className="text-plum-900/60 mb-8">
            Maak een gratis account en bekijk direct welke cursussen we aanbieden.
          </p>
          <Link
            href="/registreren"
            className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-pink-600 px-8 py-4 text-white font-semibold shadow-glow hover:-translate-y-0.5 hover:shadow-xl transition"
          >
            Start vandaag nog
          </Link>
        </div>
      </section>
    </div>
  );
}
