'use client'

import { GrainGradient } from '@paper-design/shaders-react'

export function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-20 pointer-events-none bg-black opacity-20">
      <GrainGradient
        style={{ height: '100%', width: '100%' }}
        colorBack="#000000"
        softness={0.8}
        intensity={0.6}
        noise={0.06}
        shape="corners"
        offsetX={0}
        offsetY={0}
        scale={1.2}
        rotation={45}
        speed={0.2}
        colors={['hsl(215, 25%, 35%)', 'hsl(217, 19%, 25%)', 'hsl(215, 16%, 15%)']}
      />
    </div>
  )
}
