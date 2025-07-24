'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import { SectionContainer } from "@/components/SectionContainer";
import Link from "next/link";
import { MobileMenu } from "@/components/MobileMenu";

export function HeroSection({
    images = [],
    title = "Ramesh Suthar",
    subtitle = "Experienced professional with 15 years of experience. Let's have a chat!",
    className,
    ...props
}: {
    images: string[];
    title: string;
    subtitle: string;
    className?: string;
    props?: React.HTMLAttributes<HTMLElement>;
}) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <SectionContainer
            className="relative w-full min-h-[60vh] md:min-h-[70vh] overflow-hidden"
            {...props}
        >
            <div className="absolute inset-0 z-0">
                <AnimatePresence>
                    {images.map((image, i) => (
                        <motion.div
                            key={image}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: i === index ? 1 : 0 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={image}
                                alt={`bg-${i}`}
                                fill
                                className="object-cover brightness-75"
                                priority={i === 0}
                                sizes="100vw"
                                quality={100}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <div 
                className="relative z-10 container max-w-5xl mx-auto px-6 min-h-[60vh] md:min-h-[70vh] flex flex-col justify-between py-6 md:py-12 text-white"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
            >
                <div className="flex justify-between items-start md:items-center gap-4">
                    <h2 className="text-xl font-medium">{title}</h2>
                    <div className="hidden sm:flex gap-8 text-sm">
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

                <div className="">
                    <h3 className="md:text-5xl text-3xl font-normal mb-2">{title}</h3>
                    <p className="md:text-lg text-sm">{subtitle}</p>
                </div>
            </div>
        </SectionContainer>
    );
}