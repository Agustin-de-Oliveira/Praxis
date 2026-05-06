'use client';

import { Quotes } from "@phosphor-icons/react";

const testimonials = [
  {
    quote: "I used Praxis for two weeks before my first backend role. On day one, I already knew how to navigate a codebase, run migrations, and handle a PR review. My manager thought I had prior experience.",
    name: "Elena V.",
    role: "Junior Backend Engineer",
    company: "Series B Fintech",
    highlight: "My manager thought I had prior experience.",
  },
  {
    quote: "The scenarios don't feel like tutorials — they feel like work. The first time a simulated PM pushed back on my implementation, I realized this was completely different from anything else I'd tried.",
    name: "Marcus T.",
    role: "Full-Stack Developer",
    company: "Consulting Agency",
    highlight: "they feel like work.",
  },
  {
    quote: "I've been hiring juniors for years. The ones who come through platforms like this show up with a fundamentally different level of readiness. They ask better questions, they scope better, they ship faster.",
    name: "Sarah K.",
    role: "Engineering Manager",
    company: "Enterprise SaaS",
    highlight: "a fundamentally different level of readiness.",
  },
];

export function TestimonialsSection() {
  return (
    <section>
      <div className="mb-10">
        <p className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] mb-4">
          From the field
        </p>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground font-serif">
          Real developers.<br />
          <span className="text-[#a86f44]">Real outcomes.</span>
        </h2>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="rounded-sm border border-border bg-card p-8 flex flex-col justify-between card-hover group"
          >
            <div>
              <Quotes className="h-5 w-5 text-[#a86f44]/40 mb-5" weight="fill" />
              <blockquote className="text-sm text-muted-foreground leading-relaxed">
                {t.quote}
              </blockquote>
            </div>

            <div className="mt-8 pt-5 border-t border-border/50">
              <p className="text-sm font-medium text-foreground">{t.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{t.role}</p>
              <p className="font-serif text-[10px] text-muted-foreground/60 uppercase tracking-widest mt-1">{t.company}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
