"use client";


import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  TerminalWindow,
  Play,
} from "@phosphor-icons/react";
import { HeroCard } from "@/components/hero-card";
import AboutSection from "@/components/hero-ascii-one";
import { Dithering } from "@paper-design/shaders-react";
import { Navbar } from "@/components/navbar";
import { AboutBento } from "@/components/about-bento";
import { HighlightsSection } from "@/components/highlights-section";
import { ScenarioLibrary } from "@/components/scenario-library";
import { TestimonialsSection } from "@/components/testimonials-section";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden relative">
      <Navbar />
      <div className="absolute inset-0 h-full w-full">
        <Dithering
          style={{ height: "100%", width: "100%" }}
          colorBack="hsla(0, 0%, 0%, 1.00)"
          colorFront="hsl(0, 0%, 5%)"
          shape="warp"
          type="4x4"
          pxSize={3}
          offsetX={0}
          offsetY={0}
          scale={0.8}
          rotation={0}
          speed={0.1}
        />
      </div>
      <motion.div
        className="relative z-10 mx-auto max-w-5xl py-16 md:py-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >

        {/* Hero Section */}
        <motion.header
          variants={itemVariants}
          className="mb-16"
        >
          <HeroCard />
        </motion.header>

        {/* About Section + Bento Stats */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-40"
          id="about"
        >
          <AboutSection />
          <AboutBento />
        </motion.div>

        {/* Highlights Section */}
        <motion.section
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-40"
          id="features"
        >
          <HighlightsSection />
        </motion.section>

        {/* Scenario Library */}
        <motion.section
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-40"
          id="missions"
        >
          <ScenarioLibrary />
        </motion.section>

        {/* Testimonials */}
        <motion.section
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-40"
        >
          <TestimonialsSection />
        </motion.section>

        {/* CTA Section */}
        <motion.section
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="py-20 text-center"
        >
          <h2 className="mb-6 text-3xl font-medium tracking-tight text-foreground md:text-4xl font-serif">
            Bridge the gap today.
          </h2>
          <p className="mb-10 text-muted-foreground">
            Join thousands of developers practicing real-world scenarios before their first day on the job.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="interactive inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Play weight="bold" className="h-4 w-4" />
              Start Practicing
            </Link>
            <Link
              href="/scenario"
              className="interactive inline-flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
            >
              Browse missions
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          variants={itemVariants}
          className="flex items-center justify-between border-t border-border pt-6"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-foreground">
              <TerminalWindow weight="bold" className="h-3.5 w-3.5 text-background" />
            </div>
            <span className="font-sans text-sm font-medium tracking-tight">
              praxis
            </span>
          </div>
          <nav className="flex items-center gap-5">
            <Link
              href="/dashboard"
              className="interactive text-xs text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/scenario"
              className="interactive text-xs text-muted-foreground hover:text-foreground"
            >
              Scenarios
            </Link>
          </nav>
        </motion.footer>
      </motion.div>
    </div>
  );
}
