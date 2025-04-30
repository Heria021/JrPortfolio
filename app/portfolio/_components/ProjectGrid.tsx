import { SectionContainer } from "@/components/SectionContainer";
import Image from "next/image";
export function ProjectGrid({
    projects,
    className,
    columns = "grid-cols-1 md:grid-cols-2",
    ...props
  }: {
    projects: { imageUrl: string }[];
    className?: string;
    columns?: string;
    props?: React.HTMLAttributes<HTMLElement>;
  }) {
    return (
      <SectionContainer className={className} {...props}>
        <div className={`grid ${columns} gap-y-14 gap-x-10`}>
          {projects.map((project, index) => (
            <div key={index}>
              <Image
                src={project.imageUrl}
                alt={`Work ${index + 1}`}
                width={800}
                height={800}
                className="object-cover w-full h-96 mb-4"
              />
            </div>
          ))}
        </div>
      </SectionContainer>
    );
  }