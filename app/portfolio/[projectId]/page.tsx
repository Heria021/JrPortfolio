'use client';

import { PageLayout } from "@/components/PageLayout";
import { Separator } from "@/components/ui/separator";
import { AboutSection } from "../../_components/AboutSection";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import fetchPortfolioEntries from "@/lib/Portfolio/fetchPortfolioEntries";
import { ProjectGrid } from "../_components/ProjectGrid";

export default function Portfolio() {
  const params = useParams();
  const projectId = params?.projectId;

  const [portfolioEntries, setPortfolioEntries] = useState<any[]>([]);

  useEffect(() => {
    const loadEntries = async () => {
      const data = await fetchPortfolioEntries();
      setPortfolioEntries(data || []);
    };
    loadEntries();
  }, []);

  const project = portfolioEntries.find((entry: any) => entry.projectId === projectId);

  return (
    <PageLayout>
      {/* <Separator className="my-8 bg-white" /> */}

      {/* Floor Plan Section */}
      {/* <section className="w-full">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Floor Plan</h2>
        </div>
        {project && (
          <ProjectGrid
            projects={project.uploads.map((upload: any) => ({
              imageUrl: upload.url,
            }))}
            columns="grid-cols-1 sm:grid-cols-2"
          />
        )}
      </section> */}

      <Separator className="my-4 md:my-8 bg-white" />

      {/* Results Section */}
      <section className="w-full">
        <AboutSection
          title="Results"
          paragraphs={[
            "I design with the future in mind. I bring a mindset of sustainability to the table, while always looking out for functional and aesthetically pleasing solutions."
          ]}
        />
        <div className="mt-4">
          {project && (
            <ProjectGrid
              projects={project.uploads.map((upload: any) => ({
                imageUrl: upload.url,
              }))}
              columns="grid-cols-1 sm:grid-cols-2"
            />
          )}
        </div>
      </section>
    </PageLayout>
  );
}