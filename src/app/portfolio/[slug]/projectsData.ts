export interface ProjectDetail {
  slug: string;
  client: string;
  tags: string[];
  category: string;
  description: string;
  thumbnail: string;
  media: string[];
}

/** Helper: returns true when path ends with a video extension */
export function isVideo(src: string): boolean {
  return /\.(mp4|webm|mov)$/i.test(src);
}

export const PROJECTS: ProjectDetail[] = [
  {
    slug: "zentro",
    client: "ZENTRO",
    tags: ["CRM", "WEB DEVELOPMENT", "BRAND IDENTITY"],
    category: "Web Development",
    description:
      "Lorem ipsum dolor sit consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus sociis natoque penatibus et m",
    thumbnail: "/images/projects/zentro/zentro1.jpg",
    media: [
      "/images/projects/zentro/zentro1.jpg",
      "/images/projects/zentro/zentro2.jpg",
      "/images/projects/zentro/zentro3.jpg",
      "/images/projects/zentro/zentro4.jpg",
      "/images/projects/zentro/zentro5.mp4",
      "/images/projects/zentro/zentro6.mp4",
      "/images/projects/zentro/zentro7.mp4",
      "/images/projects/zentro/zentro8.mp4",
      "/images/projects/zentro/zentro9.jpg",
      "/images/projects/zentro/zentro10.jpg",
      "/images/projects/zentro/zentro11.mp4",
      "/images/projects/zentro/zentro12.jpg",
      "/images/projects/zentro/zentro13.jpg",
      "/images/projects/zentro/zentro14.jpg",
      "/images/projects/zentro/zentro15.jpg",
      "/images/projects/zentro/zentro16.jpg",
      "/images/projects/zentro/zentro17.jpg",
      "/images/projects/zentro/zentro18.jpg",
    ],
  },
  {
    slug: "brassicolo",
    client: "BRASSICOLO",
    tags: ["BRAND IDENTITY", "COMUNICAZIONE"],
    category: "Brand Identity",
    description:
      "Lorem ipsum dolor sit consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus sociis natoque penatibus et m",
    thumbnail: "/images/projects/brassicolo/brass-1.jpg",
    media: [
      "/images/projects/brassicolo/brass-1.jpg",
      "/images/projects/brassicolo/brass2.mp4",
      "/images/projects/brassicolo/brass3.jpg",
      "/images/projects/brassicolo/brass4.jpg",
      "/images/projects/brassicolo/brass5.jpg",
      "/images/projects/brassicolo/brass6.mp4",
      "/images/projects/brassicolo/brass7.jpg",
      "/images/projects/brassicolo/brass8.mp4",
      "/images/projects/brassicolo/brass9.jpg",
      "/images/projects/brassicolo/brass10.jpg",
      "/images/projects/brassicolo/brass11.mp4",
      "/images/projects/brassicolo/brass12.mp4",
      "/images/projects/brassicolo/brass13.mp4",
      "/images/projects/brassicolo/brass14.jpg",
      "/images/projects/brassicolo/brass15.jpg",
      "/images/projects/brassicolo/brass16.mp4",
      "/images/projects/brassicolo/brass17.jpg",
      "/images/projects/brassicolo/brass18.jpg",
      "/images/projects/brassicolo/brass19.jpg",
      "/images/projects/brassicolo/brass20.jpg",
      "/images/projects/brassicolo/brass21.jpg",
    ],
  },
  {
    slug: "il-trust-in-italia",
    client: "IL TRUST IN ITALIA",
    tags: ["BRAND IDENTITY", "COMUNICAZIONE"],
    category: "Brand Identity",
    description:
      "Lorem ipsum dolor sit consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus sociis natoque penatibus et m",
    thumbnail: "/images/projects/il-trust-in-italia/trust1.jpg",
    media: [
      "/images/projects/il-trust-in-italia/trust1.jpg",
      "/images/projects/il-trust-in-italia/trust2.jpg",
      "/images/projects/il-trust-in-italia/trust3.jpg",
      "/images/projects/il-trust-in-italia/trust4.jpg",
      "/images/projects/il-trust-in-italia/trust5.jpg",
      "/images/projects/il-trust-in-italia/trust6.jpg",
      "/images/projects/il-trust-in-italia/trust7.jpg",
      "/images/projects/il-trust-in-italia/trust8.jpg",
      "/images/projects/il-trust-in-italia/trust9.jpg",
    ],
  },
  {
    slug: "perle-dell-elba",
    client: "PERLE DELL'ELBA",
    tags: ["BRAND IDENTITY", "COMUNICAZIONE"],
    category: "Brand Identity",
    description:
      "Lorem ipsum dolor sit consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus sociis natoque penatibus et m",
    thumbnail: "/images/projects/perle-dell-elba/perle2.jpg",
    media: [
      "/images/projects/perle-dell-elba/perle2.jpg",
      "/images/projects/perle-dell-elba/perle3.jpg",
      "/images/projects/perle-dell-elba/perle4.jpg",
      "/images/projects/perle-dell-elba/perle5.jpg",
    ],
  },
  {
    slug: "piano-city-napoli",
    client: "PIANO CITY NAPOLI",
    tags: ["COMUNICAZIONE", "EVENT"],
    category: "Comunicazione",
    description:
      "Lorem ipsum dolor sit consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus sociis natoque penatibus et m",
    thumbnail: "/images/projects/piano-city-napoli/pcn1.jpg",
    media: [
      "/images/projects/piano-city-napoli/pcn1.jpg",
      "/images/projects/piano-city-napoli/pcn2.jpg",
      "/images/projects/piano-city-napoli/pcn3.jpg",
      "/images/projects/piano-city-napoli/pcn4.jpg",
      "/images/projects/piano-city-napoli/pcn5.jpg",
    ],
  },
];
