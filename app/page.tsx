'use client';

import { useMemo } from "react";
import { PageLayout } from "@/components/PageLayout";
import { HeroSection } from "./_components/HeroSection";
import { AboutSection } from "./_components/AboutSection";
import { ProjectGrid } from "./_components/ProjectGrid";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const images = ["/pexels-heyho-6969873.jpg", "/pexels-heyho-6758788.jpg", "/pexels-ansar-muhammad-380085065-23916863.jpg"];

export default function Home() {
  const portfolioEntries = useQuery(api.portfolio.list, {}) ?? [];

  const formattedProjects = useMemo(() => portfolioEntries.map((entry: any) => ({
    imageUrl: entry.images?.[0]?.url || "",
    title: entry.title || "Untitled Project",
    description: entry.description || "No description available.",
    id: entry._id
  })), [portfolioEntries]);

  return (
    <>
      <HeroSection
        images={images}
        title="Jr Suthar & Designs"
        subtitle="Experienced professional with 15 years of experience. Let's have a chat!"
      />
      <PageLayout withoutHeader={true}>
        <div className="min-h-screen max-w-5xl mx-auto mt-24 text-sm">
          <AboutSection
            title="About Me"
            paragraphs={[
              "I design with the future in mind. I bring a mindset of sustainability to the table, while always looking out for functional and aesthetically pleasing solutions.",
              "From large master plans to small-scale designs, my portfolio showcases a variety of design styles and projects, each of which is a testament to my creativity and attention to detail."
            ]}
          />
          <ProjectGrid className="py-24" projects={formattedProjects} />
        </div>
      </PageLayout>
    </>
  );
}