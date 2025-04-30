'use client';

import { cn } from "@/lib/utils";

export function SectionContainer({ 
  children, 
  className, 
  id,
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  props?: React.HTMLAttributes<HTMLElement>;
}) {
  return (
    <section id={id} className={cn("w-full", className)} {...props}>
      {children}
    </section>
  );
}