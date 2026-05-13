import { ArrowRight } from 'lucide-react'
import { useState, Suspense, lazy } from 'react'

const Dithering = lazy(() =>
  import('@paper-design/shaders-react').then((mod) => ({ default: mod.Dithering }))
)

export function HeroCard() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="w-full max-w-7xl relative mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-sm border border-border bg-card shadow-sm min-h-[500px] md:min-h-[600px] flex flex-col items-center justify-center duration-500">
        <Suspense fallback={<div className="absolute inset-0 bg-muted/10" />}>
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen">
            <Dithering
              colorBack="#00000000" // Transparent
              colorFront="#94A3B8" // Steel Accent
              shape="warp"
              type="4x4"
              speed={isHovered ? 0.6 : 0.2}
              className="size-full"
              minPixelRatio={1}
            />
          </div>
        </Suspense>

        <div className="relative z-10 px-6 max-w-4xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-5xl md:text-7xl lg:text-[72px] font-medium tracking-tighter text-foreground mb-8 leading-[1.0] font-serif">
            Survive the engineering day, <br />
            <span className="text-[#a86f44]">before it starts.</span>
          </h2>

          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-12 leading-relaxed">
            Praxis is an interactive workplace simulation game. Experience the reality of
            engineering teams, production incidents, and technical debt through an immersive
            workstation.
          </p>

          <button className="group relative inline-flex h-12 items-center justify-center gap-3 rounded-sm p-[2px] bg-linear-to-b from-[#fdfdfd] via-[#fdfdfd] to-[#f1f1f1] cursor-pointer transition-all duration-300">
            <span className="flex h-full w-full items-center justify-center gap-3 rounded-[calc(0.125rem-2px)] bg-[#f1f1f1] px-10 text-sm font-medium text-primary-foreground">
              <span className="relative z-10">Enter Workstation</span>
              <ArrowRight className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
