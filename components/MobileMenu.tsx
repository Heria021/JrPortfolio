'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen((prev) => !prev);

    return (
        <>
            <Button size="icon" variant="outline" onClick={toggleMenu}>
                {isOpen ? <X /> : <Menu />}
            </Button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center space-y-6 text-white text-sm">
                    <Link href="/" onClick={toggleMenu}>
                        <p className="hover:underline">Portfolio</p>
                    </Link>
                    <Link href="/resume" onClick={toggleMenu}>
                        <p className="hover:underline">Resume</p>
                    </Link>
                </div>
            )}
        </>
    );
}