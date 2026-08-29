import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient";
import { progetti } from "@/lib/contenuti";

export async function generateStaticParams() {
  return (await progetti()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = (await progetti()).find((p) => p.slug === slug);
  if (!project) return { title: "Progetto" };

  const descrizione = project.descrizione ?? "";
  return {
    title: project.cliente,
    description: descrizione.slice(0, 160),
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: {
      title: `${project.cliente} | Seedera`,
      description: descrizione.slice(0, 200),
      url: `/portfolio/${project.slug}`,
      type: "article",
      images: [project.copertina],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.cliente} | Seedera`,
      description: descrizione.slice(0, 200),
      images: [project.copertina],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const elenco = await progetti();
  const project = elenco.find((p) => p.slug === slug);
  /* Uno slug che non esiste e' un 404, non il primo progetto dell'elenco:
     prima ogni indirizzo sbagliato mostrava Zentro con l'URL altrui. */
  if (!project) notFound();

  return (
    <ProjectDetailClient
      project={project}
      altri={elenco.filter((p) => p.slug !== slug)}
    />
  );
}
