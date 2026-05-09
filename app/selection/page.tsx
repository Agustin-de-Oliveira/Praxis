"use client"

// ─────────────────────────────────────────────────────────────────────────────
// app/selection/page.tsx
// Post-simulation hub. Cinematic, minimalist, 9:16 aspect ratio.
// Fixed: Image alignment and hover-click UX.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link"
import { motion } from "framer-motion"
import { Dithering } from "@paper-design/shaders-react"

const SELECTIONS = [
  {
    id: "hub",
    title: "Profile",
    cta: "Enter Command Center",
    href: "/dashboard",
    img: "/profile-path.png",
    color: "group-hover:text-[#a86f44]"
  },
  {
    id: "missions",
    title: "Missions",
    cta: "Browse Backlog",
    href: "/scenarios",
    img: "/scenario-path.png",
    color: "group-hover:text-white"
  }
]

export default function SelectionPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-6 overflow-hidden bg-[#050505]">

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <Dithering
          style={{ height: "100%", width: "100%" }}
          colorBack="hsla(0,0%,0%,1)"
          colorFront="hsl(0,0%,15%)"
          shape="warp"
          type="4x4"
          pxSize={4}
          speed={0.015}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl">

        {/* Minimal Header */}
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#a86f44] mb-4"
          >
            Welcome
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-serif font-medium text-white tracking-tight"
          >
            Where do you want to go?
          </motion.h1>
        </div>

        {/* 9:16 Cinematic Cards */}
        <div className="flex flex-col md:flex-row justify-center gap-10 items-center md:items-stretch">

          {SELECTIONS.map((item, i) => (
            <Link
              key={item.id}
              href={item.href}
              className="group block w-full max-w-[380px] focus:outline-none"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="relative aspect-[9/16] w-full overflow-hidden rounded-sm border border-white/5 bg-secondary/5 shadow-2xl flex flex-col justify-end p-10 transition-all duration-500 hover:border-[#a86f44]/40 hover:shadow-[#a86f44]/10"
              >
                {/* IMAGE COMPONENT (Better than background-image for aspect ratio) */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale opacity-20 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-1000 ease-out"
                  />
                </div>

                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-[1] pointer-events-none" />

                <div className="relative z-10 pointer-events-none">
                  <h2 className="text-2xl font-serif font-medium text-white mb-2 transition-transform duration-500 group-hover:-translate-y-1">
                    {item.title}
                  </h2>
                  <p className={`text-[10px] text-white/30 leading-relaxed font-mono uppercase tracking-[0.2em] transition-all duration-500 ${item.color}`}>
                    {item.cta}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}

        </div>

        {/* Subtle Credit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <a 
            href="https://twitter.com/thebtjackson" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-mono text-[7px] uppercase tracking-[0.4em] text-white/5 hover:text-[#a86f44]/40 transition-colors"
          >
            Imagery by @thebtjackson
          </a>
        </motion.div>

      </div>
    </div>
  )
}
