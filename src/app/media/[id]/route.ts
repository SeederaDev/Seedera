/**
 * I media caricati dal pannello li serve l'API, e l'API li indica con un
 * indirizzo relativo (`/media/<id>`). Sul sito quel percorso non esisteva, e
 * le foto delle persone uscivano come riquadri rotti: qui il sito lo gira
 * all'API, cosi' il browser resta su seedera.it e non deve sapere dove sta il
 * backend.
 *
 * L'id si controlla prima di chiamare: e' un uuid, e tutto il resto non deve
 * arrivare all'API come percorso costruito da chi visita.
 */
const API = process.env.API_BASE ?? "http://127.0.0.1:3001";
const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ID.test(id)) return new Response("non trovato", { status: 404 });

  let res: Response;
  try {
    res = await fetch(`${API}/media/${id}`, { cache: "no-store" });
  } catch {
    return new Response("media non raggiungibile", { status: 502 });
  }
  if (!res.ok || !res.body) return new Response("non trovato", { status: res.status === 410 ? 410 : 404 });

  return new Response(res.body, {
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/octet-stream",
      "cache-control": res.headers.get("cache-control") ?? "public, max-age=3600",
    },
  });
}
