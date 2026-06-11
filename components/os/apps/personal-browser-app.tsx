'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/os/apps/personal-browser-app.tsx
// "Browser.app" for the Personal PC — the product landing / about page.
// Renders as a browser window with tabs showing Praxis info, features, etc.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'

type Tab = 'about' | 'features' | 'how' | 'demo'

const TABS: { id: Tab; label: string }[] = [
  { id: 'about', label: '📄 Qué es Praxis' },
  { id: 'features', label: '⚙ Features' },
  { id: 'how', label: '🔄 Cómo funciona' },
  { id: 'demo', label: '▶ Demo' },
]

export default function PersonalBrowserApp() {
  const [tab, setTab] = useState<Tab>('about')

  return (
    <div className="flex flex-col h-full font-mono text-[11px]">
      {/* Browser chrome */}
      <div className="px-4 py-2 border-b border-white/[0.06] bg-white/[0.01] flex items-center gap-3">
        <div className="flex-1 px-3 py-1 rounded-sm border border-white/[0.06] bg-white/[0.03] text-white/30 text-[10px]">
          praxis-os.space/about
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.06] bg-white/[0.01]">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-[10px] cursor-pointer transition-colors border-r border-white/[0.04] last:border-r-0 ${
              tab === t.id
                ? 'text-white/90 bg-white/[0.04] border-b-2 border-b-[var(--accent)]'
                : 'text-white/30 hover:text-white/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-8 py-6">
        {tab === 'about' && (
          <div className="max-w-xl space-y-5 text-white/70 leading-7">
            <h1 className="text-[18px] font-semibold text-white/90 leading-tight">
              Praxis
            </h1>
            <p className="text-white/40 text-[10px] uppercase tracking-widest">
              Simulador de ingeniería de software inmersivo
            </p>
            <p>
              Praxis es un sistema operativo simulado donde experimentás el día a día real
              de un ingeniero de software contratado. No es LeetCode. No son acertijos de código.
            </p>
            <p>
              Trabajás en una empresa ficticia (<strong className="text-white/90">Hell Corp™</strong>),
              usás herramientas reales (Monaco Editor, GitLab, Terminal), y resolvés issues de
              código con contexto narrativo real.
            </p>
            <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-sm space-y-2">
              <p className="text-white/40 text-[9px] uppercase tracking-wider">Tecnologías</p>
              {['Monaco Editor', 'Together AI (compañeros de IA)', 'Supabase (DB + Auth)', 'Next.js 16', 'Zustand'].map((t) => (
                <div key={t} className="flex gap-2 text-[10px]">
                  <span className="text-[var(--accent)]">→</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'features' && (
          <div className="grid grid-cols-2 gap-4 max-w-2xl">
            {[
              { icon: '▣', title: 'Monaco Editor', desc: 'El mismo editor que VS Code, embebido en el OS. Autosave a la DB cada 5 segundos.' },
              { icon: '◈', title: 'GitLab.exe', desc: 'Issues de bug fixing, testing y config. Campaigns multi-capítulo. Branches reales por ticket.' },
              { icon: '◉', title: 'AI Team', desc: 'Compañeros de trabajo con personalidad propia. Pistas, contexto y drama corporativo vía Together AI.' },
              { icon: '◆', title: 'XP & Dossier', desc: 'Progresión real. Cada checkpoint verificado suma XP a skills específicas. Tu nivel refleja destreza.' },
              { icon: '◌', title: 'Kanban.exe', desc: 'Vista de progreso del ticket activo. Columnas To-Do, In Progress, Done.' },
              { icon: '◍', title: 'Terminal.exe', desc: 'Terminal simulada con comandos reales. Clone de repo, logs de build, output de tests.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--accent)] text-[14px]">{icon}</span>
                  <span className="text-white/90 text-[11px] font-semibold">{title}</span>
                </div>
                <p className="text-white/50 text-[10px] leading-5">{desc}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'how' && (
          <div className="max-w-lg space-y-4 text-white/70 leading-7">
            <h2 className="text-[15px] font-semibold text-white/90">Ciclo de trabajo</h2>
            {[
              ['01', 'Iniciás sesión y cargás el Hell Corp OS.'],
              ['02', 'Abrís GitLab.exe y te asignás un Issue o Campaign.'],
              ['03', 'El OS cambia de contexto: el IDE clona la rama del ticket.'],
              ['04', 'Escribís código en Monaco. Autosave cada 5 segundos.'],
              ['05', 'Verificás cada checkpoint con el botón "Verify".'],
              ['06', 'Al verificar todos → Merge Pull Request.'],
              ['07', 'XP acreditado. Dossier técnico actualizado. Próximo ticket.'],
            ].map(([n, text]) => (
              <div key={n} className="flex gap-4">
                <span className="text-[var(--accent)] shrink-0 text-[10px] mt-0.5">{n}</span>
                <span className="text-[11px]">{text}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'demo' && (
          <div className="max-w-md space-y-6 text-white/70 leading-7">
            <h2 className="text-[15px] font-semibold text-white/90">Modo Tour</h2>
            <p>
              Podés probar el OS sin crear una cuenta. El modo Tour te da acceso a un
              escenario de ejemplo pre-cargado con guías y contexto.
            </p>
            <p className="text-white/40 text-[10px]">
              El modo Tour no guarda progreso. Para guardar XP y tu dossier
              necesitás una cuenta.
            </p>
            <Link
              href="/tour/SCN-008"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white/70 text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white/90 transition-all rounded-sm"
            >
              Abrir modo Tour
              <ExternalLink size={11} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
