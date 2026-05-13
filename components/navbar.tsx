"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense, lazy } from "react";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
);

const navLinks = [
  { name: "Operational Log", href: "#missions" },
  { name: "System Specs", href: "#features" },
  { name: "Protocol", href: "#about" },
];

export function Navbar() {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center">
      <nav className="relative w-full max-w-5xl  overflow-hidden rounded-sm border border-border/60 bg-card/60 backdrop-blur-md shadow-2xl">


        <div className="relative z-10 flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="interactive group relative font-serif text-[12px] uppercase tracking-[0.2em] text-foreground hover:text-foreground"
              >
                <span className="relative">
                  {link.name}
                  <span className="absolute -bottom-1.5 left-0 h-[1px] w-0 bg-[#a86f44] transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>
            ))}
          </div>

          <Link
            href="/login"
            className="font-serif text-[12px] uppercase tracking-[0.2em] text-foreground hover:text-foreground transition-colors"
          >
            [ Access ]
          </Link>
        </div>
      </nav>
    </div>
  );
}
