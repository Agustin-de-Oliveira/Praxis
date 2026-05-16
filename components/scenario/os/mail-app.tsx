'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Star,
  Send,
  Trash2,
  Archive,
  Inbox,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import type { Scenario } from '@/lib/scenario-types'

interface MailAppProps {
  scenario?: Scenario
  onDownload: (fileName: string) => void
  initialEmails?: any[]
}

export default function MailApp({ scenario, onDownload, initialEmails }: MailAppProps) {
  const [selectedMail, setSelectedMail] = useState<number | null>(0)
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDownload = (file: string) => {
    setDownloading(file)
    setTimeout(() => {
      setDownloading(null)
      onDownload(file)
    }, 1500)
  }

  const defaultEmails = [
    {
      id: 0,
      from: 'Elena (Eng Ops)',
      role: 'Candidate Experience',
      subject: 'Welcome to your Praxis Workstation',
      time: 'Just now',
      isUnread: true,
      content: `Hello,

I've provisioned your candidate workspace. This terminal is your primary interface for the duration of the evaluation process.

To get started:
1. Open Browser.exe and navigate to praxis://profile to finalize your Engineering Dossier.
2. Once your dossier is filed, the Job Board will mount active roles from our partner firms.
3. Apply to a role that matches your stack to receive your first technical challenge.

If you have questions, the internal docs are available at praxis://docs.

Good luck,
Elena`,
      attachments: [],
    },
    {
      id: 1,
      from: 'System',
      role: 'OS Kernel',
      subject: 'Workspace Provisioning Report',
      time: '2m ago',
      isUnread: false,
      content:
        'All systems nominal. Encrypted tunnel established. Terminal, Browser, and Mail services are online. Local storage mounted at /home/candidate.',
      attachments: ['system_report.log'],
    },
  ]

  const emails =
    initialEmails ||
    (scenario
      ? [
          {
            id: 0,
            from: 'Sarah Chen',
            role: 'Senior Developer',
            subject: `Project Access Provisioned: ${scenario.ticket.key}`,
            time: '10:42 AM',
            isUnread: true,
            content: `Hey,
      
I've just finished provisioning your access to the repository for ${scenario.ticket.key}. 

We're seeing some critical edge cases in the production logs related to "${scenario.title}". The PM is breathing down our necks on this one, so I need you to jump in immediately.

I've attached the full spec brief to this thread. You'll need to use the workstation terminal to clone the repo once you're ready.

Git Repo: praxis-internal/${scenario.ticket.key.toLowerCase()}
Branch: feature/fix-hydration

Good luck,
Sarah`,
            attachments: ['spec_brief.pdf', 'access_keys.gpg'],
          },
          ...defaultEmails.map((e) => ({ ...e, id: e.id + 1 })),
        ]
      : defaultEmails)

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0A0A0A]">
      {/* Sidebar */}
      <div className="w-[180px] border-r border-white/5 bg-white/[0.01] flex flex-col p-2 gap-1">
        <button className="flex items-center gap-3 px-3 py-2 bg-[#a86f44] text-white rounded-sm mb-4 hover:brightness-110 transition-all shadow-lg shadow-[#a86f44]/10">
          <Send size={14} className="-rotate-45" />
          <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Compose</span>
        </button>

        {[
          { icon: Inbox, label: 'Inbox', count: 1, active: true },
          { icon: Star, label: 'Starred', count: 0 },
          { icon: Send, label: 'Sent', count: 12 },
          { icon: Archive, label: 'Archive', count: 452 },
          { icon: Trash2, label: 'Trash', count: 3 },
        ].map((item, i) => (
          <button
            key={i}
            className={`flex items-center justify-between px-3 py-2 rounded-sm transition-colors ${item.active ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white/60'}`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={14} className={item.active ? 'text-[#a86f44]' : ''} />
              <span className="font-mono text-[9px] uppercase tracking-widest">{item.label}</span>
            </div>
            {item.count > 0 && (
              <span className="font-mono text-[8px] opacity-40">{item.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Mail List */}
      <div className="w-[300px] border-r border-white/5 flex flex-col bg-black/20">
        <div className="p-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/20">
            Inbox
          </span>
          <div className="flex items-center gap-2">
            <ChevronLeft size={14} className="text-white/20 cursor-not-allowed" />
            <ChevronRight size={14} className="text-white/20 cursor-not-allowed" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {emails.map((mail, i) => (
            <button
              key={mail.id}
              onClick={() => setSelectedMail(mail.id)}
              className={`w-full p-4 border-b border-white/5 text-left transition-all relative ${selectedMail === mail.id ? 'bg-[#a86f44]/5 border-l-2 border-l-[#a86f44]' : 'hover:bg-white/5 border-l-2 border-l-transparent'}`}
            >
              {mail.isUnread && (
                <div className="absolute top-5 right-4 w-1.5 h-1.5 rounded-full bg-[#a86f44]" />
              )}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`font-mono text-[10px] uppercase tracking-wider ${mail.isUnread ? 'text-white' : 'text-white/60'}`}
                >
                  {mail.from}
                </span>
                <span className="font-mono text-[8px] text-white/20">{mail.time}</span>
              </div>
              <p
                className={`text-[11px] truncate mb-1 ${mail.isUnread ? 'text-white/90' : 'text-white/40'}`}
              >
                {mail.subject}
              </p>
              <p className="text-[10px] text-white/20 truncate line-clamp-1 italic">
                {mail.content}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Mail Body */}
      <div className="flex-1 min-h-0 flex flex-col bg-[#050505] relative overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedMail !== null ? (
            <motion.div
              key={selectedMail}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 min-h-0 flex flex-col h-full"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <button className="p-1.5 rounded-sm hover:bg-white/10 text-white/40 transition-colors">
                    <Archive size={14} />
                  </button>
                  <button className="p-1.5 rounded-sm hover:bg-white/10 text-white/40 transition-colors">
                    <AlertCircle size={14} />
                  </button>
                  <button className="p-1.5 rounded-sm hover:bg-white/10 text-white/40 transition-colors text-red-500/40 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                  <div className="w-px h-4 bg-white/5 mx-1" />
                  <button className="p-1.5 rounded-sm hover:bg-white/10 text-white/40 transition-colors">
                    <Clock size={14} />
                  </button>
                  <button className="p-1.5 rounded-sm hover:bg-white/10 text-white/40 transition-colors">
                    <CheckCircle2 size={14} />
                  </button>
                </div>
                <button className="p-1.5 rounded-sm hover:bg-white/10 text-white/40 transition-colors">
                  <MoreVertical size={14} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full select-text">
                <h2 className="font-serif text-2xl text-white mb-6 leading-tight">
                  {emails[selectedMail].subject}
                </h2>

                <div className="flex items-start justify-between mb-8 pb-8 border-b border-white/5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-sm bg-[#a86f44]/10 border border-[#a86f44]/20 flex items-center justify-center text-[#a86f44] font-bold text-sm shrink-0">
                      {emails[selectedMail].from
                        .split(' ')
                        .map((n: string) => n[0])
                        .filter((char: string) => /[a-zA-Z]/.test(char))
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <div className="flex flex-col">
                        <span className="text-base font-medium text-white leading-tight">
                          {emails[selectedMail].from}
                        </span>
                        <span className="font-mono text-[10px] text-[#a86f44] uppercase tracking-[0.2em] mt-1">
                          {emails[selectedMail].role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-white/30">
                        <span className="font-mono text-[9px] uppercase tracking-widest">To:</span>
                        <span className="font-mono text-[9px] lowercase tracking-wider truncate">
                          &lt;{emails[selectedMail].from.toLowerCase().replace(/[\s()]/g, '.')}
                          @praxis.internal&gt;
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
                      {emails[selectedMail].time}
                    </span>
                    <button className="px-4 py-1.5 border border-white/10 rounded-sm text-[10px] text-white/50 hover:bg-white/5 hover:text-white font-mono uppercase tracking-widest transition-colors">
                      Reply
                    </button>
                  </div>
                </div>

                <div className="font-mono text-[12px] text-white/70 leading-relaxed whitespace-pre-wrap mb-12">
                  {emails[selectedMail].content}
                </div>

                {emails[selectedMail].attachments.length > 0 && (
                  <div className="space-y-3">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-white/20 mb-2">
                      Attachments ({emails[selectedMail].attachments.length})
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {emails[selectedMail].attachments.map((file: any, idx: number) => (
                        <div
                          key={idx}
                          onClick={() => !downloading && handleDownload(file)}
                          className={`p-3 bg-white/[0.02] border rounded-sm flex items-center justify-between group transition-all cursor-pointer ${downloading === file ? 'border-[#a86f44] animate-pulse' : 'border-white/5 hover:border-white/20'}`}
                        >
                          <div className="flex items-center gap-3">
                            <Paperclip
                              size={12}
                              className={`transition-colors ${downloading === file ? 'text-[#a86f44]' : 'text-white/40 group-hover:text-[#a86f44]'}`}
                            />
                            <span
                              className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${downloading === file ? 'text-[#a86f44]' : 'text-white/60 group-hover:text-white'}`}
                            >
                              {downloading === file ? 'Downloading...' : file}
                            </span>
                          </div>
                          <span className="font-mono text-[8px] text-white/10 uppercase group-hover:text-white/40">
                            244 KB
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-4 text-white/20">
                  <ShieldCheck size={14} className="text-emerald-500/40" />
                  <p className="font-mono text-[8px] uppercase tracking-widest">
                    Message verified via Praxis Secure Gateway
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-20">
              <Mail size={48} strokeWidth={1} />
              <p className="font-mono text-[10px] uppercase tracking-[0.4em]">
                Select an email to view
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
