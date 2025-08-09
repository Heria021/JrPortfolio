"use client"

import { ConvexProvider, ConvexReactClient } from "convex/react";
import React from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  // eslint-disable-next-line no-console
  console.warn("NEXT_PUBLIC_CONVEX_URL is not set. Convex client will not connect.");
}

const convex = new ConvexReactClient(convexUrl ?? "");

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}


