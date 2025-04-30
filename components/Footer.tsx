'use client';

import Link from "next/link";

export function Footer() {
  return (
    <section className="">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Hariom Suthar</h2>
          <p className="flex flex-wrap gap-x-2 gap-y-1 text-sm leading-relaxed text-muted-foreground">
            <span>123 Demo Street, New York NY</span>
            <span>|</span>
            <span>(555) 555-5555</span>
            <span>|</span>
            <span>hariomsuthar7143@gmail.com</span>
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground mt-2">© Hariom Suthar, 2025</p>
        </div>

        <div className="text-sm leading-relaxed text-start lg:text-right text-muted-foreground space-y-4">
          <Link href="/"><p className="hover:underline">Portfolio</p></Link>
          <Link href="/resume"><p className="hover:underline">Resume</p></Link>
        </div>
      </div>
    </section>
  );
}