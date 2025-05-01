'use client';

import Link from "next/link";

export function Footer() {
  return (
    <section className="">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 py-6 md:py-12">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Ramesh Suthar</h2>
          <p className="flex flex-wrap gap-x-2 gap-y-1 text-sm leading-relaxed text-muted-foreground">
            <span>Narayani Traders, PWD Road, Bidasar</span>
            <span>|</span>
            <span>Rajasthan, India</span>
            <span>|</span>
            <span>(+91) 9782353866</span>
            <span>|</span>
            <span>rameshsuthar32@gmail.com</span>
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground ">© Ramesh Suthar, 2025</p>
        </div>

        <div className="text-sm leading-relaxed text-start lg:text-right text-muted-foreground flex flex-col gap-2">
          <Link href="/"><p className="hover:underline">Portfolio</p></Link>
          <Link href="/resume"><p className="hover:underline">Resume</p></Link>
        </div>
      </div>
    </section>
  );
}