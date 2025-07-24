'use client';

import Link from "next/link";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <div className="flex justify-between items-center w-full py-6 md:py-12">
      <h2 className="text-xl font-semibold">Jr Suthar & Designs</h2>
      <div className="hidden sm:flex gap-8">
        <Link href="/">
          <p className="hover:underline cursor-pointer">Portfolio</p>
        </Link>
        <Link href="/resume">
          <p className="hover:underline cursor-pointer">Resume</p>
        </Link>
      </div>
      <div className="block sm:hidden">
        <MobileMenu />
      </div>
    </div>
  );
}