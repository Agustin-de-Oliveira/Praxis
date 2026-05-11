"use client"

// ─────────────────────────────────────────────────────────────────────────────
// Welcome gateway shown after auth — explains the Praxis OS handoff.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from "framer-motion"
import { Terminal, ArrowRight } from "lucide-react"

type WelcomeGatewayProps = {
  variant?: "inline" | "fullscreen"
  onContinue: () => void
}

export function WelcomeGateway({ variant = "fullscreen", onContinue }: WelcomeGatewayProps) {
  const wrap =
    variant === "fullscreen"
      ? "fixed inset-0 z-[10001] flex items-center justify-center bg-background px-6"
      : "flex items-center justify-center min-h-[50vh] px-6"

  return (
    <motion.div
      className={wrap}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-sm border border-border bg-card p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2.5 mb-8">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-foreground">
            <Terminal className="h-3.5 w-3.5 text-background" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Session secured
          </span>
        </div>

        <p className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">What happens next</p>
        <h2 className="font-serif text-2xl tracking-tight text-foreground mb-4 leading-snug">
          You&apos;re about to boot into{" "}
          <span className="text-[#a86f44]">Praxis OS.</span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          Your candidate workstation loads next: inbox, terminal, browser, and missions—all in one desk. If you&apos;re new,
          you&apos;ll set your engineering identity right inside the shell before picking up work.
        </p>

        <button
          type="button"
          onClick={onContinue}
          className="group w-full flex items-center justify-center gap-2 h-11 rounded-sm bg-foreground text-sm font-medium text-background hover:bg-foreground/90 transition-colors cursor-pointer"
        >
          Continue to workstation
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </motion.div>
    </motion.div>
  )
}
