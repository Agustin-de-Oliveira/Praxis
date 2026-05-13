'use client'

import { ArrowRight, BookOpen } from 'lucide-react'

export default function AboutSection() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-sm border border-border bg-card grid md:grid-cols-2 min-h-[500px]">
        {/* Left Side: Text Content */}
        <div className="p-8 md:p-12 flex flex-col justify-center border-r border-border/40">
          <div className="mb-6 inline-flex items-center gap-2 font-serif text-[10px] uppercase tracking-widest text-[#a86f44]">
            <BookOpen className="h-3 w-3" />
            The Workstation
          </div>

          <h2 className="text-4xl lg:text-5xl font-medium tracking-tighter text-foreground mb-6 leading-tight font-serif">
            Work by doing. <br />
            <span className="text-[#a86f44]">Not just watching.</span>
          </h2>

          <p className="text-muted-foreground text-sm md:text-base max-w-md mb-10 leading-relaxed font-sans opacity-80">
            Bridge the gap between theory and the actual job. Enter a high-fidelity workstation that
            mimics a real engineering day, complete with a simulated team and live production
            incidents.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="group relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-sm bg-foreground px-6 text-xs font-bold uppercase tracking-widest text-background transition-all hover:bg-foreground/90">
              Initialize Session
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Right Side: Featured Image */}
        <div className="relative h-[400px] md:h-auto bg-black overflow-hidden">
          {/* Normal Image */}
          <img
            src="/about-section-image.jpg"
            alt="Praxis Learning"
            className="h-full w-full object-cover opacity-90"
          />

          {/* Subtle Grain Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-50 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

          <div className="absolute top-4 right-4 font-serif text-[8px] text-white/20 uppercase tracking-widest">
            Photo by{' '}
            <a href="https://unsplash.com/@wistomsin" target="_blank">
              Tom Barrett
            </a>{' '}
            on{' '}
            <a href="https://unsplash.com/" target="_blank">
              Unsplash
            </a>
          </div>

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-card via-transparent to-transparent md:block hidden" />
        </div>
      </div>
    </div>
  )
}
