'use client';

import { Timer, Code, Trophy, Heartbeat } from "@phosphor-icons/react";

const highlights = [
  {
    icon: Code,
    title: "Write real code",
    description: "No multiple choice. No toy examples. Ship features, fix bugs, and deploy to production-grade clusters.",
  },
  {
    icon: Timer,
    title: "Time-boxed missions",
    description: "Every scenario is scoped like a real sprint ticket — clear acceptance criteria, deadline pressure included.",
  },
  {
    icon: Trophy,
    title: "Earn verified XP",
    description: "Automated validators grade your work. Progress is tracked, skills are mapped to industry frameworks.",
  },
  {
    icon: Heartbeat,
    title: "Fail safely",
    description: "Break things without consequences. Roll back, retry, learn from the blast radius — that's the point.",
  },
];

export function HighlightsSection() {
  return (
    <section>
      <div className="mb-10">
        <p className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] mb-4">
          How it works
        </p>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground font-serif">
          Built for the way<br />
          <span className="text-[#a86f44]">engineers actually learn.</span>
        </h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-sm border border-border bg-card p-7 card-hover group flex flex-col"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-secondary">
                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-[#a86f44] transition-colors duration-300" weight="bold" />
              </div>
              <p className="font-serif text-[9px] uppercase tracking-widest text-muted-foreground mb-3">
                0{index + 1}
              </p>
              <h4 className="text-base font-medium text-foreground mb-2 font-serif">{item.title}</h4>
              <p className="text-xs leading-relaxed text-muted-foreground flex-1">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
