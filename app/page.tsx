'use client';

import { useEffect, useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { HeroSection } from "./_components/HeroSection";
import { AboutSection } from "./_components/AboutSection";
import { ProjectGrid } from "./_components/ProjectGrid";
import fetchPortfolioEntries from "@/lib/Portfolio/fetchPortfolioEntries";

const images = ["/fur2.jpg", "/fur3.jpg", "/image.png"];

export default function Home() {
  const [portfolioEntries, setPortfolioEntries] = useState<any[]>([]);

  useEffect(() => {
    const loadEntries = async () => {
      const data = await fetchPortfolioEntries();
      setPortfolioEntries(data || []);
    };
    loadEntries();
  }, []);

  const formattedProjects = portfolioEntries.map((entry: any) => ({
    imageUrl: entry.uploads?.[0]?.url || "",
    title: entry.projectName || "Untitled Project",
    description: entry.description || "No description available.",
    id: entry.projectId
  }));

  return (
    <>
      <HeroSection
        images={images}
        title="Hariom Suthar"
        subtitle="Experienced professional with 5 years of experience. Let's have a chat!"
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