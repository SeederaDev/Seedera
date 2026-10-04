"use client";

import { useEffect, useRef } from "react";

/* Il grafo del "second brain" nella hero: note e collegamenti, come la vista a
   grafo di un vault. Quattro livelli (centro, aree, temi, note), qualche nota
   orfana alla deriva, collegamenti trasversali curvi. Ogni nodo ha una
   profondita': quelli lontani sono piu' piccoli e chiari e si spostano meno
   col puntatore, cosi' il grafo ha volume senza simulare il 3D.
   Simulazione a forze scritta qui: trecento nodi non giustificano una
   dipendenza. I nodi restano fuori dal blocco di testo (#hero-block) e la
   scala si adatta da sola allo spazio libero. */

type Nodo = {
  x: number; y: number; vx: number; vy: number;
  sx: number; sy: number; // posizione disegnata, con la parallasse
  z: number; // profondita' 0 (lontano) .. 1 (vicino)
  livello: number; // 0 centro, 1 area, 2 tema, 3 nota, 4 sotto-nota, 9 orfana
  grado: number;
  vuoto: boolean; // nota disegnata a cerchio aperto
  etichetta?: string;
  conta?: number;
  padre: number;
  nato: number;
  posato: boolean;
  fase: number;
  vicini: number[];
};
type Arco = { a: number; b: number; riposo: number; forza: number; curva: number };
type Impulso = { percorso: number[]; t: number; velocita: number };

// i18n-ignora: sito solo in italiano, etichette decorative del grafo
const AREE = ["progetti", "clienti", "persone", "concetti", "documenti", "dati", "codice"];

function rng(seme: number) {
  return () => {
    seme = (seme * 1664525 + 1013904223) % 4294967296;
    return seme / 4294967296;
  };
}

function costruisci(densita: number) {
  const r = rng(11);
  const nodi: Nodo[] = [];
  const archi: Arco[] = [];
  const nuovo = (livello: number, padre: number, etichetta?: string): number => {
    const vicino = livello <= 1 ? 0.85 + r() * 0.15 : livello === 9 ? r() * 0.35 : 0.15 + r() * 0.85;
    nodi.push({
      x: 0, y: 0, vx: 0, vy: 0, sx: 0, sy: 0, z: vicino, livello, grado: 0,
      vuoto: livello >= 3 && livello < 9 && r() < 0.16, etichetta, padre,
      nato: Infinity, posato: false, fase: r() * Math.PI * 2, vicini: [],
    });
    return nodi.length - 1;
  };
  const collega = (a: number, b: number, riposo: number, forza: number, curva = 0) => {
    if (a === b || nodi[a].vicini.includes(b)) return;
    archi.push({ a, b, riposo, forza, curva });
    nodi[a].vicini.push(b);
    nodi[b].vicini.push(a);
  };

  const centro = nuovo(0, -1);
  const aree: number[] = [];
  const note: number[][] = [];
  AREE.forEach((nome) => {
    const area = nuovo(1, centro, nome);
    aree.push(area);
    collega(centro, area, 120, 0.03);
    const mie: number[] = [];
    const temi = 2 + Math.floor(r() * 3);
    for (let t = 0; t < temi; t++) {
      const tema = nuovo(2, area);
      collega(area, tema, 58, 0.05);
      mie.push(tema);
      // Distribuzione a coda lunga: pochi temi densi, molti radi.
      const n = Math.round((3 + Math.floor(r() * r() * 16)) * densita);
      for (let i = 0; i < n; i++) {
        const nota = nuovo(3, tema);
        collega(tema, nota, 20 + r() * 12, 0.07);
        mie.push(nota);
        if (r() < 0.22) {
          const k = 1 + Math.floor(r() * 3);
          for (let j = 0; j < k; j++) {
            const sotto = nuovo(4, nota);
            collega(nota, sotto, 13, 0.08);
            mie.push(sotto);
          }
        }
      }
    }
    // Qualche nota appesa direttamente all'area.
    for (let i = 0; i < Math.round(3 * densita); i++) {
      const nota = nuovo(3, area);
      collega(area, nota, 30, 0.06);
      mie.push(nota);
    }
    note.push(mie);
  });
  // Collegamenti trasversali: e' qui che un archivio diventa un cervello.
  for (let i = 0; i < Math.round(48 * densita); i++) {
    const g1 = Math.floor(r() * note.length);
    let g2 = Math.floor(r() * note.length);
    if (g2 === g1) g2 = (g2 + 1) % note.length;
    const a = note[g1][Math.floor(r() * note[g1].length)];
    const b = r() < 0.15 ? aree[g2] : note[g2][Math.floor(r() * note[g2].length)];
    collega(a, b, 150, 0.0025, (r() - 0.5) * 0.5);
  }
  for (let i = 0; i < aree.length; i++) {
    collega(aree[i], aree[(i + 2) % aree.length], 190, 0.004, 0.18);
  }
  // Orfane: note non ancora collegate a niente, alla deriva sul bordo.
  for (let i = 0; i < Math.round(36 * densita); i++) nuovo(9, -1);

  for (const n of nodi) n.grado = n.vicini.length;
  aree.forEach((a) => {
    // Le note di un'area: tutto cio' che discende da lei.
    let conta = 0;
    const coda = [a];
    while (coda.length) {
      const c = coda.pop()!;
      for (const v of nodi[c].vicini) if (nodi[v].padre === c) { conta++; coda.push(v); }
    }
    nodi[a].conta = conta;
  });
  return { nodi, archi };
}

// Punto di controllo di una quadratica spostato di lato, e punto sulla curva.
function controllo(a: Nodo, b: Nodo, curva: number) {
  const mx = (a.sx + b.sx) / 2, my = (a.sy + b.sy) / 2;
  return { x: mx - (b.sy - a.sy) * curva, y: my + (b.sx - a.sx) * curva };
}
function punto(a: Nodo, b: Nodo, c: { x: number; y: number }, t: number) {
  const u = 1 - t;
  return {
    x: u * u * a.sx + 2 * u * t * c.x + t * t * b.sx,
    y: u * u * a.sy + 2 * u * t * c.y + t * t * b.sy,
  };
}

export default function HeroGraph({ ritardo = 1200 }: { ritardo?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const sezione = canvas?.closest("section");
    if (!canvas || !ctx || !sezione) return;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = getComputedStyle(document.body).fontFamily;
    const fondo = getComputedStyle(sezione).backgroundColor;

    const desktopIniziale = canvas.getBoundingClientRect().width >= 768;
    const { nodi, archi } = costruisci(desktopIniziale ? 1 : 0.4);
    const impulsi: Impulso[] = [];
    // Ordine di disegno: dal fondo verso chi guarda.
    const ordine = nodi.map((_, i) => i).sort((a, b) => nodi[a].z - nodi[b].z);

    let w = 0, h = 0, cx = 0, cy = 0, alto = 0;
    let scala = 1, bersaglio = 300, gravita = 0.0016;
    let ostacolo = { x0: 0, y0: 0, x1: 0, y1: 0 };
    let soloSopra = false; // a destra del testo non c'e' spazio: si esce solo verso l'alto
    let schiaccia = 1; // su mobile lo spazio e' una fascia: piu' gravita' in verticale

    const misura = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const box = canvas.getBoundingClientRect();
      w = box.width;
      h = box.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const desktop = w >= 768;
      alto = desktop ? 104 : 88;
      gravita = desktop ? 0.0012 : 0.003;
      // Il titolo e' nowrap e sborda dal blocco: si misura l'unione dei due.
      const el = document.getElementById("hero-block");
      if (el) {
        const rr = [el, ...el.querySelectorAll(".hero-line")].map((x) => x.getBoundingClientRect());
        const m = desktop ? 40 : 22;
        ostacolo = {
          x0: Math.min(...rr.map((x) => x.left)) - box.left - m,
          y0: Math.min(...rr.map((x) => x.top)) - box.top - m,
          x1: Math.max(...rr.map((x) => x.right)) - box.left + m,
          y1: Math.max(...rr.map((x) => x.bottom)) - box.top + m,
        };
      }
      soloSopra = w - ostacolo.x1 < 160;
      schiaccia = desktop ? 1 : 2.2;
      // Il baricentro sta nello spazio libero, in alto a destra.
      cx = desktop ? w * 0.74 : w * 0.5;
      cy = desktop ? alto + (h - alto) * 0.36 : alto + (ostacolo.y0 - alto) * 0.5;
      bersaglio = desktop
        ? Math.min(w * 0.4, (h - alto) * 0.68)
        : Math.sqrt(w * Math.max(80, ostacolo.y0 - alto)) * 0.72;
    };
    misura();

    // Nascita per livelli: il grafo si apre dal centro verso fuori.
    const r = rng(3);
    const passoLivello = quieto ? 0 : 420;
    nodi.forEach((n) => {
      const l = n.livello === 9 ? 5 : n.livello;
      n.nato = quieto ? 0 : ritardo + l * passoLivello + r() * (l >= 3 ? 900 : 260);
    });

    const nasci = (t: number) => {
      for (const n of nodi) {
        if (n.posato || n.nato > t) continue;
        n.posato = true;
        const p = n.padre >= 0 ? nodi[n.padre] : null;
        const ang = r() * Math.PI * 2;
        if (!p) {
          const d = n.livello === 9 ? bersaglio * (0.9 + r() * 0.5) : 0;
          n.x = cx + Math.cos(ang) * d;
          n.y = cy + Math.sin(ang) * d;
          continue;
        }
        n.x = p.x + Math.cos(ang) * 4;
        n.y = p.y + Math.sin(ang) * 4;
        n.vx = Math.cos(ang) * 1.6;
        n.vy = Math.sin(ang) * 1.6;
      }
    };

    let presa: Nodo | null = null;

    const simula = (t: number) => {
      const vivi = nodi.filter((n) => n.posato);
      const k2 = scala * scala;
      for (let i = 0; i < vivi.length; i++) {
        const a = vivi[i];
        for (let j = i + 1; j < vivi.length; j++) {
          const b = vivi[j];
          let dx = a.x - b.x, dy = a.y - b.y;
          let d2 = dx * dx + dy * dy;
          if (d2 > 60000 * k2) continue;
          if (d2 < 0.01) { dx = r() - 0.5; dy = r() - 0.5; d2 = 0.5; }
          const peso = (a.livello <= 2 ? 3 : 1) + (b.livello <= 2 ? 3 : 1);
          // Le aree si tengono larghe: ognuna porta un'etichetta da leggere.
          const aree = a.livello === 1 && b.livello === 1 ? 4 : 1;
          const f = (110 * peso * aree * k2) / d2;
          const d = Math.sqrt(d2);
          a.vx += (dx / d) * f; a.vy += (dy / d) * f;
          b.vx -= (dx / d) * f; b.vy -= (dy / d) * f;
          // Due etichette sulla stessa riga si separano in verticale.
          if (aree > 1 && Math.abs(dy) < 22 && Math.abs(dx) < 130) {
            const verso = dy >= 0 ? 1 : -1;
            a.vy += verso * 0.5;
            b.vy -= verso * 0.5;
          }
        }
      }
      for (const e of archi) {
        const a = nodi[e.a], b = nodi[e.b];
        if (!a.posato || !b.posato) continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = (d - e.riposo * scala) * e.forza;
        a.vx += (dx / d) * f; a.vy += (dy / d) * f;
        b.vx -= (dx / d) * f; b.vy -= (dy / d) * f;
      }
      // La scala insegue lo spazio libero: si misura il raggio medio dei nodi
      // collegati (le orfane stanno fuori apposta) e si corregge piano.
      let somma = 0, quanti = 0;
      for (const n of vivi) {
        if (n.livello === 9) continue;
        somma += Math.hypot(n.x - cx, n.y - cy);
        quanti++;
      }
      if (quanti > 20) {
        const medio = (somma / quanti) * 1.7;
        scala = Math.max(0.35, Math.min(2.6, scala * (1 + (bersaglio / medio - 1) * 0.01)));
      }
      const o = ostacolo;
      for (const n of vivi) {
        const g = n.livello === 9 ? gravita * 0.5 : gravita;
        n.vx += (cx - n.x) * g;
        n.vy += (cy - n.y) * g * schiaccia;
        if (t > 0) {
          n.vx += Math.cos(t / 2600 + n.fase) * 0.012;
          n.vy += Math.sin(t / 3300 + n.fase * 1.3) * 0.012;
        }
        // Il testo: le aree ne stanno fuori (la loro etichetta non deve
        // finirci sopra), le note possono scivolarci sotto un po', e li'
        // si schiariscono (vedi dietro()).
        if (n.x > o.x0 && n.x < o.x1 && n.y > o.y0 && n.y < o.y1) {
          const suSopra = n.y - o.y0, aDestra = o.x1 - n.x;
          const k = n.livello <= 1 ? 1 : 0.06;
          if (soloSopra || suSopra < aDestra) n.vy -= (suSopra * 0.08 + 0.4) * k;
          else n.vx += (aDestra * 0.08 + 0.4) * k;
        }
        // Le aree portano l'etichetta a destra: lasciano posto per leggerla.
        // Inquadratura stretta: le note possono uscire a destra e in alto, come
        // se la hero mostrasse solo un pezzo di un grafo piu' grande. Le aree
        // restano dentro, perche' la loro etichetta deve leggersi.
        const bordo = 18;
        const fuori = n.livello <= 1 ? 0 : 160;
        // circa 8,5px a lettera in maiuscolo spaziato, piu' il conto delle note
        const destra = w - bordo - (n.etichetta ? n.etichetta.length * 8.5 + 44 : 0) + fuori;
        const sopra = alto - (n.livello <= 1 ? 0 : 30); // sopra c'e' il menu
        if (n.y < sopra) n.vy += (sopra - n.y) * 0.05;
        if (n.y > h - bordo) n.vy -= (n.y - (h - bordo)) * 0.05;
        if (n.x > destra) n.vx -= (n.x - destra) * 0.05;
        if (n.x < bordo) n.vx += (bordo - n.x) * 0.05;
        if (n !== presa) {
          n.vx *= 0.8; n.vy *= 0.8;
          n.x += n.vx; n.y += n.vy;
        }
        n.x = Math.max(-200, Math.min(w + 200, n.x));
        n.y = Math.max(-200, Math.min(h, n.y));
      }
    };

    // Con movimento ridotto il grafo compare gia' assestato: si simula a vuoto.
    if (quieto) {
      nasci(0);
      for (let k = 0; k < 700; k++) simula(0);
    }

    // Parallasse: il puntatore sposta i piani vicini piu' dei lontani; senza
    // puntatore il grafo ondeggia piano da solo.
    let mx = 0, my = 0, mxs = 0, mys = 0, puntatoreDentro = false;
    const parallasse = (t: number) => {
      const tx = puntatoreDentro ? mx : Math.sin(t / 7000) * 0.35;
      const ty = puntatoreDentro ? my : Math.cos(t / 9000) * 0.25;
      mxs += (tx - mxs) * (quieto ? 1 : 0.04);
      mys += (ty - mys) * (quieto ? 1 : 0.04);
      const ampiezza = quieto ? 0 : 26;
      for (const n of nodi) {
        const p = (n.z - 0.5) * ampiezza;
        n.sx = n.x + mxs * p;
        n.sy = n.y + mys * p * 0.7;
      }
    };

    // Puntatore sul grafo: passaggio evidenzia i vicini, trascinamento sposta.
    let sopra = -1;
    const trova = (x: number, y: number) => {
      let best = -1, bd = 16 * 16;
      nodi.forEach((n, i) => {
        if (!n.posato) return;
        const d = (n.sx - x) ** 2 + (n.sy - y) ** 2;
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    };
    const locale = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top] as const;
    };
    const muoviSezione = (e: PointerEvent) => {
      const b = sezione.getBoundingClientRect();
      mx = ((e.clientX - b.left) / b.width) * 2 - 1;
      my = ((e.clientY - b.top) / b.height) * 2 - 1;
      puntatoreDentro = true;
    };
    const esciSezione = () => { puntatoreDentro = false; };
    const muovi = (e: PointerEvent) => {
      const [px, py] = locale(e);
      if (presa) { presa.x = px; presa.y = py; presa.vx = 0; presa.vy = 0; return; }
      sopra = trova(px, py);
      canvas.style.cursor = sopra >= 0 ? "grab" : "";
      if (quieto && !raf) disegna(1e9);
    };
    const giu = (e: PointerEvent) => {
      const [x, y] = locale(e);
      const i = trova(x, y);
      if (i < 0) return;
      presa = nodi[i];
      sopra = i;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
      riprendi();
    };
    const su = () => {
      presa = null;
      canvas.style.cursor = sopra >= 0 ? "grab" : "";
    };
    const esci = () => { if (!presa) sopra = -1; };
    sezione.addEventListener("pointermove", muoviSezione);
    sezione.addEventListener("pointerleave", esciSezione);
    canvas.addEventListener("pointermove", muovi);
    canvas.addEventListener("pointerdown", giu);
    canvas.addEventListener("pointerup", su);
    canvas.addEventListener("pointercancel", su);
    canvas.addEventListener("pointerleave", esci);

    // Impulso: un pensiero che salta di nota in nota, lasciando una scia.
    const nuovoImpulso = () => {
      const partenze = nodi.filter((n) => n.posato && n.livello >= 3 && n.livello < 9);
      if (!partenze.length) return;
      let c = nodi.indexOf(partenze[Math.floor(r() * partenze.length)]);
      const percorso = [c];
      for (let k = 0; k < 4 + Math.floor(r() * 3); k++) {
        const scelte = nodi[c].vicini.filter((v) => !percorso.includes(v));
        if (!scelte.length) break;
        // Preferisce i nodi piu' collegati: i pensieri passano dai temi.
        scelte.sort((a, b) => nodi[b].grado - nodi[a].grado);
        c = r() < 0.6 ? scelte[0] : scelte[Math.floor(r() * scelte.length)];
        percorso.push(c);
      }
      if (percorso.length > 2) impulsi.push({ percorso, t: 0, velocita: 0.0016 + r() * 0.0008 });
    };
    const arcoFra = (a: number, b: number) =>
      archi.find((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a));
    // La curva va letta nel verso del percorso: invertita se l'arco e' al contrario.
    const tratto = (da: number, a: number) => {
      const e = arcoFra(da, a);
      if (!e) return null;
      const A = nodi[da], B = nodi[a];
      return { A, B, c: controllo(A, B, e.a === da ? e.curva : -e.curva) };
    };

    let luce = 0;
    let fuoco = -1;

    const disegna = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      if (sopra >= 0) fuoco = sopra;
      luce += ((sopra >= 0 ? 1 : 0) - luce) * (quieto ? 1 : 0.1);
      const vicini = fuoco >= 0 ? new Set([fuoco, ...nodi[fuoco].vicini]) : null;
      const entrata = (n: Nodo) => Math.min(1, Math.max(0, (t - n.nato) / 650));
      const profondita = (z: number) => 0.28 + 0.72 * z;
      // Quanto un punto sta dietro il testo: 0 fuori, 1 dentro da 60px in su.
      const o = ostacolo;
      const dietro = (x: number, y: number) => {
        const d = Math.min(x - o.x0, o.x1 - x, y - o.y0, o.y1 - y);
        return Math.max(0, Math.min(1, d / 60));
      };

      ctx.lineCap = "round";
      for (const e of archi) {
        const a = nodi[e.a], b = nodi[e.b];
        const v = Math.min(entrata(a), entrata(b));
        if (v <= 0) continue;
        const acceso = vicini !== null && (e.a === fuoco || e.b === fuoco);
        const trasversale = e.forza < 0.01;
        const base = (trasversale ? 0.13 : 0.3) * profondita((a.z + b.z) / 2);
        const velo = 1 - 0.7 * dietro((a.sx + b.sx) / 2, (a.sy + b.sy) / 2);
        const alfa = (acceso ? base + (0.85 - base) * luce : base * (1 - 0.6 * luce)) * velo;
        ctx.strokeStyle = `rgba(0,0,0,${alfa * v})`;
        ctx.lineWidth = acceso ? 0.6 + 0.6 * luce : trasversale ? 0.5 : 0.7;
        // L'arco si disegna dal padre verso la nota appena nata (de Casteljau).
        const c = controllo(a, b, e.curva);
        const fine = punto(a, b, c, v);
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.quadraticCurveTo(a.sx + (c.x - a.sx) * v, a.sy + (c.y - a.sy) * v, fine.x, fine.y);
        ctx.stroke();
      }

      for (const p of impulsi) {
        const segmenti = p.percorso.length - 1;
        const testa = p.t * segmenti;
        const scia = 1.1;
        ctx.lineWidth = 1.4;
        for (let s = Math.max(0, Math.floor(testa - scia)); s <= Math.min(segmenti - 1, Math.floor(testa)); s++) {
          const tr = tratto(p.percorso[s], p.percorso[s + 1]);
          if (!tr) continue;
          const t0 = Math.max(0, testa - scia - s), t1 = Math.min(1, testa - s);
          if (t1 <= t0) continue;
          const passi = 8;
          for (let k = 0; k < passi; k++) {
            const ta = t0 + ((t1 - t0) * k) / passi, tb = t0 + ((t1 - t0) * (k + 1)) / passi;
            const pa = punto(tr.A, tr.B, tr.c, ta), pb = punto(tr.A, tr.B, tr.c, tb);
            const coda = 1 - (testa - (s + tb)) / scia;
            ctx.strokeStyle = `rgba(0,0,0,${Math.max(0, coda) * 0.9})`;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
          }
        }
        const s = Math.min(segmenti - 1, Math.floor(testa));
        const tr = tratto(p.percorso[s], p.percorso[s + 1]);
        if (tr) {
          const q = punto(tr.A, tr.B, tr.c, Math.min(1, testa - s));
          ctx.fillStyle = "#000";
          ctx.beginPath();
          ctx.arc(q.x, q.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (const i of ordine) {
        const n = nodi[i];
        const v = entrata(n);
        if (v <= 0) continue;
        const dentro = !vicini || vicini.has(i);
        const alfa =
          (n.livello === 9 ? 0.45 : 1) * profondita(n.z) * (dentro ? 1 : 1 - 0.65 * luce) * v *
          (1 - 0.7 * dietro(n.sx, n.sy));
        // Ingresso con un piccolo sovraccarico di scala, poi si assesta.
        const crescita = v < 1 ? 1 + Math.sin(v * Math.PI) * 0.6 : 1;
        const base =
          n.livello === 0 ? 6.5 : n.livello === 1 ? 4.6 : n.livello === 9 ? 1.1 : 1 + Math.sqrt(n.grado) * 0.75;
        const raggio =
          base * (0.55 + 0.45 * n.z) * Math.min(1.8, scala) * crescita * (i === fuoco ? 1 + 0.5 * luce : 1);
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, raggio, 0, Math.PI * 2);
        if (n.vuoto) {
          // Cerchio aperto: il fondo copre gli archi che arrivano al centro.
          ctx.fillStyle = fondo;
          ctx.fill();
          ctx.strokeStyle = `rgba(0,0,0,${alfa})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(0,0,0,${alfa})`;
          ctx.fill();
        }
        if (n.livello <= 1) {
          ctx.strokeStyle = `rgba(0,0,0,${0.32 * alfa})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.arc(n.sx, n.sy, raggio + 4.5, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (i === fuoco && luce > 0.01) {
          ctx.strokeStyle = `rgba(0,0,0,${0.6 * luce})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.arc(n.sx, n.sy, raggio + 7 + 3 * luce, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Etichette delle aree: maiuscolo spaziato, il conto delle note accanto.
      ctx.textBaseline = "middle";
      const spaziato = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
      nodi.forEach((n, i) => {
        if (!n.etichetta) return;
        const v = Math.min(1, Math.max(0, (t - n.nato - 350) / 700));
        if (v <= 0) return;
        const dentro = !vicini || vicini.has(i);
        const x = n.sx + 13, y = n.sy;
        spaziato.letterSpacing = "0.09em";
        ctx.font = `500 10.5px ${font}`;
        const testo = n.etichetta.toUpperCase();
        ctx.fillStyle = `rgba(0,0,0,${(dentro ? 0.86 : 0.3) * v})`;
        ctx.fillText(testo, x, y);
        const largo = ctx.measureText(testo).width;
        spaziato.letterSpacing = "0px";
        ctx.font = `400 10.5px ${font}`;
        ctx.fillStyle = `rgba(0,0,0,${(dentro ? 0.42 : 0.16) * v})`;
        ctx.fillText(String(n.conta ?? ""), x + largo + 7, y);
      });
    };

    let raf = 0;
    let visibile = true;
    let prossimo = 0;
    let ultimo = performance.now();
    const avvio = ultimo;
    const fineCrescita = ritardo + 5 * passoLivello + 1400;

    const giro = (ora: number) => {
      raf = 0;
      const t = ora - avvio;
      const dt = Math.min(64, ora - ultimo);
      ultimo = ora;
      if (!quieto) {
        nasci(t);
        simula(t);
        if (t > fineCrescita && t > prossimo) {
          nuovoImpulso();
          prossimo = t + 900 + r() * 1600;
        }
        for (let k = impulsi.length - 1; k >= 0; k--) {
          const p = impulsi[k];
          p.t += (dt * p.velocita * 2.2) / (p.percorso.length - 1);
          if (p.t >= 1) impulsi.splice(k, 1);
        }
      } else if (presa) {
        simula(0);
      }
      parallasse(t);
      disegna(quieto ? 1e9 : t);
      if (visibile && !document.hidden && (!quieto || presa)) raf = requestAnimationFrame(giro);
    };
    function riprendi() {
      if (!raf && visibile && !document.hidden && (!quieto || presa)) {
        ultimo = performance.now();
        raf = requestAnimationFrame(giro);
      }
    }
    raf = requestAnimationFrame(giro);

    // Fuori schermo o scheda nascosta: il ciclo si ferma.
    const io = new IntersectionObserver(([e]) => {
      visibile = e.isIntersecting;
      riprendi();
    });
    io.observe(sezione);
    const onVis = () => riprendi();
    document.addEventListener("visibilitychange", onVis);
    const onResize = () => {
      misura();
      riprendi();
      if (quieto) { parallasse(0); disegna(1e9); }
    };
    window.addEventListener("resize", onResize, { passive: true });
    // Il blocco di testo si assesta dopo i font: si rimisura una volta.
    const t1 = setTimeout(misura, 600);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      sezione.removeEventListener("pointermove", muoviSezione);
      sezione.removeEventListener("pointerleave", esciSezione);
      canvas.removeEventListener("pointermove", muovi);
      canvas.removeEventListener("pointerdown", giu);
      canvas.removeEventListener("pointerup", su);
      canvas.removeEventListener("pointercancel", su);
      canvas.removeEventListener("pointerleave", esci);
    };
  }, [ritardo]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full touch-pan-y"
    />
  );
}
