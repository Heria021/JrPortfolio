'use client';

import { SectionContainer } from "@/components/SectionContainer";

export function ResumeItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="font-medium">{label}</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}

export function ResumeCategory({ 
  title, 
  items = []
}: {
  title: string;
  items: { label: string; value: string }[];
}) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <ResumeItem key={index} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
}

export function ResumeSection({
  title = "Resume",
  education = [
    { label: "Master's degree", value: "2018–19" },
    { label: "Bachelor's degree", value: "2014–19" },
    { label: "High School", value: "2010–14" }
  ],
  skills = [
    { label: "Revit", value: "Expert" },
    { label: "ArchiCAD", value: "Intermediate" },
    { label: "Adobe Creative Suite", value: "Intermediate" }
  ],
  experience = [
    { label: "Passion for design", value: "3D rendering" },
    { label: "Attention to detail", value: "Problem solving" },
    { label: "Critical thinking", value: "Project management" }
  ],
  className,
  ...props
}: {
  title?: string;
  education?: { label: string; value: string }[];
  skills?: { label: string; value: string }[];
  experience?: { label: string; value: string }[];
  className?: string;
  props?: React.HTMLAttributes<HTMLElement>;
}) {
  return (
    <SectionContainer className={className} {...props}>
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ResumeCategory title="Education" items={education} />
        <ResumeCategory title="Skills" items={skills} />
        <ResumeCategory title="Work Experience" items={experience} />
      </div>
    </SectionContainer>
  );
}