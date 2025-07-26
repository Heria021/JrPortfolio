'use client';

import Image from "next/image";

export function Footer() {
  return (
    <section className="">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 py-6 md:py-12">
        {/* Logo - appears first on mobile, second on desktop */}
        <div className="flex justify-start lg:justify-end lg:order-2">
          <Image
            src="/logo.png"
            alt="Jr Suthar & Designs Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

        {/* Text content - appears second on mobile, first on desktop */}
        <div className="space-y-2 lg:order-1">
          <h2 className="text-2xl font-semibold">Jr Suthar & Designs</h2>
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
      </div>
    </section>
  );
}