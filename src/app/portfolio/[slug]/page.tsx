import type { Metadata } from "next";
import ProjectDetailClient from "./ProjectDetailClient";
import { PROJECTS } from "./projectsData";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Progetto" };

  return {
    title: project.client,
    description: project.description.slice(0, 160),
    openGraph: {
      title: `${project.client} | Seedera`,
      description: project.description.slice(0, 200),
      type: "article",
      images: [project.thumbnail],
    },
  };
}

export default function ProjectDetailPage() {
  return <ProjectDetailClient />;
}
