'use client';

import { SectionContainer } from "@/components/SectionContainer";
import Image from "next/image";
import Link from "next/link";

export function ProjectGrid({
  projects,
  withDetails = true,
  className,
  columns = "grid-cols-1 md:grid-cols-2",
  ...props
}: {
  projects: { imageUrl: string; title: string; description: string; id: string }[];
  withDetails?: boolean;
  className?: string;
  columns?: string;
  props?: React.HTMLAttributes<HTMLElement>;
}) {
  return (
    <SectionContainer className={className} {...props}>

      <div className={`grid ${columns} gap-y-14 gap-x-10`}>
        {projects.map((project, index) => (
          <Link href={`/portfolio/${project?.id}`} key={index}>
          <div key={index}>
            <Image
              src={project.imageUrl}
              alt={`Work ${index + 1}`}
              width={800}
              height={800}
              className="object-contain w-full mb-4 bg-white"
            />
            {withDetails && (
              <div>
                <h2 className="text-lg font-semibold">{project.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              </div>
            )}
          </div>
          </Link>
        ))}
      </div>
    </SectionContainer>
  );
}