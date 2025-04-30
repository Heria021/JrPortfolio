'use client';

import { SectionContainer } from "@/components/SectionContainer";


export function AboutSection({
  title = "About Me",
  paragraphs = [
    "I design with the future in mind. I bring a mindset of sustainability to the table, while always looking out for functional and aesthetically pleasing solutions.",
    "From large master plans to small-scale designs, my portfolio showcases a variety of design styles and projects, each of which is a testament to my creativity and attention to detail."
  ],
  className,
  ...props
}: {
  title?: string;
  paragraphs?: string[];
  className?: string;
  props?: React.HTMLAttributes<HTMLElement>;
}) {
  return (
    <SectionContainer className={className} {...props}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        </div>
        <div className="text-sm leading-relaxed text-muted-foreground space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}