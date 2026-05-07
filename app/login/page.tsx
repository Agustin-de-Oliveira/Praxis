"use client";

import Link from "next/link";
import { useState } from "react";
import { Terminal, ArrowRight, Github, Chrome, Mail, Lock } from "lucide-react";
import { Dithering } from "@paper-design/shaders-react";
import ThermodynamicGrid from "@/components/interactive-thermodynamic-grid";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-12">

      {/* Dithering background — same as landing */}
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

      {/* Floating card */}
      <div className="relative z-10 w-full max-w-4xl flex rounded-sm border border-border overflow-hidden shadow-2xl">

        {/* ── Left: Form ────────────────────────────────── */}
        <div className="flex flex-col justify-between w-full md:w-[380px] shrink-0 bg-card px-10 py-10">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 self-start group mb-10">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-foreground">
              <Terminal className="h-3.5 w-3.5 text-background" />
            </div>
            <span className="font-sans text-sm font-medium tracking-tight text-foreground">
              praxis
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <p className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
              {mode === "login" ? "Welcome back" : "Get started"}
            </p>
            <h1 className="text-2xl font-medium tracking-tight text-foreground font-serif leading-tight">
              {mode === "login" ? (
                <>Sign in to your<br /><span className="text-[#a86f44]">workspace.</span></>
              ) : (
                <>Create your<br /><span className="text-[#a86f44]">account.</span></>
              )}
            </h1>
          </div>

          {/* OAuth */}
          <div className="space-y-2 mb-6">
            <button className="w-full flex items-center justify-center gap-3 h-10 rounded-sm border border-border bg-secondary hover:bg-secondary/60 text-xs font-medium text-foreground transition-colors cursor-pointer">
              <Github className="h-4 w-4" />
              Continue with GitHub
            </button>
            <button className="w-full flex items-center justify-center gap-3 h-10 rounded-sm border border-border bg-secondary hover:bg-secondary/60 text-xs font-medium text-foreground transition-colors cursor-pointer">
              <Chrome className="h-4 w-4" />
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 font-serif text-[9px] uppercase tracking-widest text-muted-foreground">
                or email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-3 mb-6">
            <div>
              <label className="block font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full h-10 rounded-sm border border-border bg-secondary pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[#a86f44]/60 focus:ring-1 focus:ring-[#a86f44]/20 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 rounded-sm border border-border bg-secondary pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[#a86f44]/60 focus:ring-1 focus:ring-[#a86f44]/20 transition-colors"
                />
              </div>
            </div>

            {mode === "login" && (
              <div className="flex justify-end">
                <button type="button" className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground hover:text-[#a86f44] transition-colors cursor-pointer">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 h-10 rounded-sm bg-foreground text-xs font-medium text-background hover:bg-foreground/90 transition-colors cursor-pointer"
            >
              {mode === "login" ? "Sign in" : "Create account"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          {/* Toggle + footer */}
          <div className="flex flex-col gap-4 mt-auto">
            <p className="text-xs text-muted-foreground">
              {mode === "login" ? "No account yet?" : "Already have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-[#a86f44] hover:text-foreground transition-colors cursor-pointer font-medium"
              >
                {mode === "login" ? "Sign up free" : "Sign in"}
              </button>
            </p>
            <p className="font-serif text-[9px] uppercase tracking-widest text-muted-foreground/40">
              By continuing, you agree to our Terms of Service
            </p>
          </div>
        </div>

        {/* ── Right: ThermodynamicGrid ───────────────────── */}
        <div className="relative hidden md:flex flex-1 flex-col items-center justify-center overflow-hidden min-h-[500px]">
          <ThermodynamicGrid
            resolution={22}
            coolingFactor={0.97}
            className="absolute inset-0"
          />

          {/* Overlay quote */}
          <div className="relative z-10 px-10 text-center pointer-events-none select-none">
            <blockquote className="text-lg font-serif font-medium text-foreground/90 leading-snug mb-4">
              "The best way to learn<br />engineering is to{" "}
              <span className="text-[#a86f44]">engineer something.</span>"
            </blockquote>
            <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground/60">
              — The Praxis Manifesto
            </p>
          </div>

          {/* Hint */}
          <p className="absolute bottom-6 left-6 font-serif text-[9px] uppercase tracking-widest text-muted-foreground/30 pointer-events-none select-none z-10">
            Move cursor to explore
          </p>
        </div>

      </div>
    </div>
  );
}
