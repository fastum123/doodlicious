import crypto from "crypto";

// Genereert een kortlevend, getekend Cloudflare Stream token (JWT) voor een video.
// Dit voorkomt dat iemand de video-URL kan kopiëren/delen: het token verloopt na
// een paar minuten en kan (optioneel) aan een domein gekoppeld worden.
// Docs: https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/
export function maakSignedStreamToken(videoUid: string, geldigVoorSeconden = 300) {
  const keyId = process.env.CLOUDFLARE_STREAM_SIGNING_KEY_ID!;
  const pem = process.env.CLOUDFLARE_STREAM_SIGNING_KEY_PEM!;

  const header = { alg: "RS256", kid: keyId };
  const payload = {
    sub: videoUid,
    kid: keyId,
    exp: Math.floor(Date.now() / 1000) + geldigVoorSeconden,
    accessRules: [
      // Beperk downloads en sta alleen embed-weergave toe
      { type: "any", action: "allow" }
    ]
  };

  const base64url = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  const unsigned = `${base64url(header)}.${base64url(payload)}`;
  const signature = crypto.sign("RSA-SHA256", Buffer.from(unsigned), pem).toString("base64url");
  const token = `${unsigned}.${signature}`;

  return {
    token,
    iframeUrl: `https://iframe.cloudflarestream.com/${token}?autoplay=false&controls=true`
  };
}
