'use client';

const stats = [
  { value: "50+", label: "Operational Incidents", sublabel: "across backend, infra & security" },
  { value: "12k", label: "Sessions Logged", sublabel: "by developers worldwide" },
  { value: "94%", label: "Survived the Week", sublabel: "with positive team reputation" },
];

export function AboutBento() {
  return (
    <div className="w-full max-w-7xl mx-auto mt-3">
      <div className="grid gap-3 md:grid-cols-3">

        {/* Large stat card — spans 2 cols */}
        <div className="md:col-span-2 rounded-sm border border-border bg-card p-8 md:p-10 flex flex-col justify-between min-h-[220px]">
          <div>
            <p className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] mb-6">
              By the numbers
            </p>
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl md:text-4xl font-serif font-medium text-foreground tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-foreground mt-1 font-medium">{stat.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{stat.sublabel}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pull quote card */}
        <div className="rounded-sm border border-border bg-card p-8 flex flex-col justify-between min-h-[220px]">
          <div>
            <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-6">
              Philosophy
            </p>
            <blockquote className="text-lg font-serif text-foreground leading-relaxed italic">
              "The best way to learn engineering is to <span className="text-[#a86f44] not-italic font-medium">engineer something.</span>"
            </blockquote>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-6">
            — The Praxis Manifesto
          </p>
        </div>

        {/* Wide CTA strip */}
        <div className="md:col-span-3 rounded-sm border border-border bg-card p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Ready for active duty?</p>
            <p className="text-xs text-muted-foreground mt-0.5">Select an incident and stabilize the system.</p>
          </div>
          <a
            href="#missions"
            className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] hover:text-foreground transition-colors"
          >
            Review Workstream →
          </a>
        </div>

      </div>
    </div>
  );
}
