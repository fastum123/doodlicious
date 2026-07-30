"use client";

import { useEffect, useState } from "react";

// Beveiligde videospeler:
// - haalt een kortlevend, getekend Cloudflare Stream token op via onze eigen API
//   (nooit een publieke/permanente video-URL in de HTML)
// - blokkeert rechtermuisklik, tekstselectie en drag op de player
// - Cloudflare's iframe-embed staat downloaden zelf al standaard uit
export default function VideoPlayer({ lessonId }: { lessonId: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [fout, setFout] = useState<string | null>(null);

  useEffect(() => {
    let actief = true;
    fetch(`/api/video-token?lessonId=${lessonId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Geen toegang tot deze video.");
        return res.json();
      })
      .then((data) => {
        if (actief) setSrc(data.iframeUrl);
      })
      .catch((err) => actief && setFout(err.message));
    return () => {
      actief = false;
    };
  }, [lessonId]);

  if (fout) {
    return <div className="aspect-video rounded-xl bg-pink-50 flex items-center justify-center text-red-600">{fout}</div>;
  }

  if (!src) {
    return <div className="aspect-video rounded-xl bg-pink-50 animate-pulse" />;
  }

  return (
    <div
      className="video-shield aspect-video rounded-xl overflow-hidden bg-black"
      onContextMenu={(e) => e.preventDefault()}
    >
      <iframe
        src={src}
        className="w-full h-full"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-presentation"
      />
    </div>
  );
}
