'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/os/apps/personal-mail-app.tsx
// Mail app for the Personal PC landing.
//
// Two states:
//  - No session: Shows the Hell Corp job offer (CTA → /login)
//  - Has session: Shows a reminder that the user has an active shift (CTA → /os)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { ArrowRight, Inbox } from 'lucide-react'

interface PersonalMailAppProps {
  hasSession: boolean
  onAccept: () => void
  onGoToWork: () => void
}

const SIDEBAR_FOLDERS = ['Inbox (1)', 'Sent', 'Drafts', 'Spam', 'Trash']

export default function PersonalMailApp({ hasSession, onAccept, onGoToWork }: PersonalMailAppProps) {
  const [selected, setSelected] = useState<'hellcorp' | null>('hellcorp')

  return (
    <div className="flex h-full text-white/80 font-mono text-[11px]">
      {/* Sidebar */}
      <div className="w-44 shrink-0 border-r border-white/[0.06] flex flex-col bg-white/[0.01]">
        <div className="px-3 py-3 border-b border-white/[0.04]">
          <p className="text-[9px] uppercase tracking-widest text-white/30">Mail.app</p>
        </div>
        <div className="flex flex-col gap-0.5 p-2">
          {SIDEBAR_FOLDERS.map((f) => (
            <div
              key={f}
              className={`px-2 py-1.5 rounded-sm text-[10px] cursor-pointer transition-colors ${
                f.startsWith('Inbox') ? 'text-white/80 bg-white/[0.04]' : 'text-white/30 hover:text-white/50'
              }`}
            >
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Message list */}
      <div className="w-52 shrink-0 border-r border-white/[0.06] flex flex-col">
        <div className="px-3 py-3 border-b border-white/[0.04]">
          <p className="text-[9px] uppercase tracking-widest text-white/30">Inbox</p>
        </div>
        <div
          className={`m-2 p-3 rounded-sm cursor-pointer border transition-all ${
            selected === 'hellcorp'
              ? 'border-[var(--accent)]/40 bg-[var(--accent)]/10'
              : 'border-white/[0.06] hover:bg-white/[0.03]'
          }`}
          onClick={() => setSelected('hellcorp')}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-white/90 font-semibold">Hell Corp™</span>
            <span className="text-[8px] text-white/30">09:41</span>
          </div>
          <p className="text-[9px] text-white/50 leading-4 line-clamp-2">
            {hasSession
              ? '[RECORDATORIO] Tu turno está activo. La empresa...'
              : '[OFERTA LABORAL] Ingeniero de Software — Posición inmediata...'}
          </p>
          {!hasSession && (
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] mt-2" />
          )}
        </div>
      </div>

      {/* Message body */}
      <div className="flex-1 flex flex-col overflow-auto">
        {selected === 'hellcorp' ? (
          <div className="flex flex-col h-full">
            {/* Mail header */}
            <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.01]">
              <p className="text-[13px] font-semibold text-white/90 mb-3">
                {hasSession
                  ? '[RECORDATORIO] Tu turno está activo'
                  : '[OFERTA LABORAL] Ingeniero de Software — Posición inmediata'}
              </p>
              {[
                ['De', 'rrhh@hellcorp.internal'],
                ['Para', 'yo@personal.com'],
                ['Fecha', 'Hoy, 09:41 AM'],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-2 text-[10px] leading-5">
                  <span className="text-white/30 w-10 shrink-0">{label}:</span>
                  <span className="text-white/60">{value}</span>
                </div>
              ))}
            </div>

            {/* Mail body */}
            <div className="flex-1 px-6 py-5 space-y-4 text-[12px] leading-6 text-white/70 overflow-auto">
              {hasSession ? (
                <>
                  <p>Empleado/a,</p>
                  <p>
                    Nuestros sistemas detectaron que no se encuentra en su puesto de trabajo.
                    Cada segundo de ausencia está siendo registrado y descontado de su evaluación
                    de rendimiento trimestral.
                  </p>
                  <p>
                    Su presencia es requerida de <strong className="text-white/90">forma inmediata</strong>.
                    Hell Corp™ no tolera la inactividad.
                  </p>
                  <p className="text-white/30 text-[10px] italic">
                    Hell Corp™ se preocupa por su productividad.
                  </p>
                  <button
                    onClick={onGoToWork}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent)] text-[10px] uppercase tracking-widest hover:bg-[var(--accent)]/25 transition-all cursor-pointer rounded-sm"
                  >
                    Volver al trabajo
                    <ArrowRight size={12} />
                  </button>
                </>
              ) : (
                <>
                  <p>Estimado/a candidato/a:</p>
                  <p>
                    Tras analizar exhaustivamente su perfil técnico, el Departamento de
                    Recursos Humanos de <strong className="text-white/90">Hell Corp™</strong> le
                    extiende una oferta de empleo formal e irrevocable.
                  </p>
                  <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-sm text-[10px] space-y-1.5 leading-5">
                    <p className="text-white/40 uppercase tracking-wider mb-2">Términos y Condiciones:</p>
                    <p>• Salario: <span className="text-white/60">[CONFIDENCIAL]</span></p>
                    <p>• Beneficios: <span className="text-white/60">[N/A]</span></p>
                    <p>• Monitoreo: <span className="text-white/60">24 horas / 7 días</span></p>
                    <p>• Vacaciones: <span className="text-white/60">0 (cero) días hábiles</span></p>
                    <p>• Cláusula 7b: el empleado renuncia a sus horas de sueño.</p>
                    <p>• Cláusula 12c: Hell Corp™ se reserva el derecho de monitorear
                      sus pensamientos durante el horario laboral.</p>
                  </div>
                  <p className="text-white/50">
                    Al aceptar, usted reconoce haber leído y comprendido todos los
                    términos anteriores, incluyendo los que aún no han sido escritos.
                  </p>
                  <p className="text-white/20 text-[10px] italic">
                    Hell Corp™ es una empresa que se preocupa por sus empleados.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={onAccept}
                      className="flex items-center gap-2 px-5 py-2.5 bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] uppercase tracking-widest hover:bg-red-500/25 transition-all cursor-pointer rounded-sm"
                    >
                      Aceptar oferta y firmar contrato
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-3">
            <Inbox size={32} strokeWidth={1} />
            <p className="text-[10px] uppercase tracking-widest">Seleccioná un mensaje</p>
          </div>
        )}
      </div>
    </div>
  )
}
