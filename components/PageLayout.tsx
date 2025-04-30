'use client';

import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function PageLayout({ 
  children, 
  className,
  withoutHeader = false,
  withoutFooter = false,
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  withoutHeader?: boolean;
  withoutFooter?: boolean;
  props?: React.HTMLAttributes<HTMLElement>;
}) {
  return (
    <main className={cn(
      "min-h-screen max-w-5xl mx-auto text-sm text-foreground px-6",
      className
    )} {...props}>
      {!withoutHeader && <Header />}
      {children}
      {!withoutFooter && <Footer />}
    </main>
  );
}