'use client';

import { Timer, Code, Trophy, Activity } from "lucide-react";

const highlights = [
  {
    icon: Code,
    title: "Immersive Workstation",
    description: "Enter a high-fidelity OS. Check your mail, respond to incidents, and manage your team from a persistent terminal.",
  },
  {
    icon: Timer,
    title: "Narrative Arcs",
    description: "Progression isn't just XP. It's reputation, trust, and access to more critical systems as you move from Trainee to Lead.",
  },
  {
    icon: Trophy,
    title: "Real Feedback",
    description: "Not just checks. Get code reviews, team feedback, and post-mortems that feel human and carry emotional weight.",
  },
  {
    icon: Activity,
    title: "Professional Survival",
    description: "Survive the Friday deploy, navigate technical debt, and make tradeoffs that impact the team's long-term health.",
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
          Engineered for the way<br />
          <span className="text-[#a86f44]">professional growth happens.</span>
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
                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-[#a86f44] transition-colors duration-300" />
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
