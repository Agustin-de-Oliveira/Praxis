'use client'

import { useState, useEffect } from 'react'
import {
  GitPullRequest,
  CheckCircle2,
  AlertCircle,
  Play,
  Loader2,
  GitMerge,
  Terminal,
  Code,
  FolderGit,
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useMissionStore } from '@/lib/store/mission-store'
import { useWindowStore } from '@/lib/store/window-store'
import { toast } from 'sonner'
import type { Scenario, ScenarioProgress } from '@/lib/scenario-types'
import { Badge } from '@/components/ui/badge'

export default function GitLabApp() {
  const supabase = createClient()
  const { activeProgress, activeScenario, startWork, stopWork } = useMissionStore()
  const { openWindow } = useWindowStore()

  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [progresses, setProgresses] = useState<ScenarioProgress[]>([])
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'issues' | 'campaigns'>('issues')
  const [loading, setLoading] = useState(true)

  // Fetch scenarios and progress from Supabase
  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: scns } = await supabase
        .from('scenarios')
        .select('*')
        .eq('is_published', true)

      const { data: progs } = await supabase
        .from('scenario_progress')
        .select('*')
        .eq('user_id', user.id)

      if (scns) setScenarios(scns)
      if (progs) setProgresses(progs)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [activeProgress])

  const handleStartWork = async (scenario: Scenario) => {
    setLoadingId(scenario.id)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Authentication Error', { description: 'No active session found.' })
        return
      }

      // Check if progress already exists
      let progress = progresses.find(p => p.scenario_id === scenario.id)

      if (!progress) {
        // Create new progress in Supabase
        const { data: newProg, error } = await supabase
          .from('scenario_progress')
          .insert({
            user_id: user.id,
            scenario_id: scenario.id,
            status: 'in_progress',
            started_at: new Date().toISOString(),
            current_code_state: scenario.repo_initial?.files || {},
          })
          .select()
          .single()

        if (error) throw error
        progress = newProg as ScenarioProgress
      } else if (progress.status === 'completed') {
        // Allow resetting/re-doing work
        const { data: resetProg, error } = await supabase
          .from('scenario_progress')
          .update({
            status: 'in_progress',
            checkpoints_passed: [],
            current_code_state: scenario.repo_initial?.files || {},
            started_at: new Date().toISOString(),
            completed_at: null,
          })
          .eq('id', progress.id)
          .select()
          .single()

        if (error) throw error
        progress = resetProg as ScenarioProgress
      }

      // Start working in Zustand store
      startWork(scenario, progress!)
      
      // Auto-open IDE and Terminal windows
      openWindow('ide')
      openWindow('terminal')

      toast.success('Workspace Initialized', {
        description: `Successfully checked out branch for ${scenario.ticket.key}.`,
      })
    } catch (err: any) {
      console.error(err)
      toast.error('Workspace Initialization Failed', {
        description: err.message || 'Error communicating with Supabase.',
      })
    } finally {
      setLoadingId(null)
    }
  }

  const handleMergePR = async () => {
    if (!activeProgress || !activeScenario) return
    
    // Validate that all checkpoints have been passed
    const allPassed = activeScenario.checkpoints.every(cp => 
      activeProgress.checkpoints_passed.includes(cp.id)
    )

    if (!allPassed) {
      toast.error('Merge Rejected', {
        description: 'You must pass all checkpoints before merging this PR into main.',
      })
      return
    }

    setLoadingId(activeScenario.id)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Update progress in Supabase
      const { error } = await supabase
        .from('scenario_progress')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', activeProgress.id)

      if (error) throw error

      // Award XP to profile
      const xpToAward = activeScenario.estimated_duration_minutes * 10 // e.g. 10 XP per minute
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('total_xp, level')
        .eq('id', user.id)
        .single()

      if (currentProfile) {
        const newXp = (currentProfile.total_xp || 0) + xpToAward
        const newLevel = Math.floor(newXp / 1000) + 1 // Level up every 1000 XP
        
        await supabase
          .from('profiles')
          .update({
            total_xp: newXp,
            level: newLevel,
          })
          .eq('id', user.id)
      }

      toast.success('Pull Request Merged! 🎉', {
        description: `Successfully merged changes into main. Awarded ${xpToAward} XP.`,
      })

      // Return OS to Idle state
      stopWork()
      fetchData()
    } catch (err: any) {
      console.error(err)
      toast.error('Merge Failed', {
        description: err.message || 'Failed to merge PR in Supabase.',
      })
    } finally {
      setLoadingId(null)
    }
  }

  // Filter Issues (simple / complex) and Campaigns (end-to-end)
  const issues = scenarios.filter(s => s.type === 'simple' || s.type === 'complex')
  const campaigns = scenarios.filter(s => s.type === 'end-to-end')

  const itemsToRender = activeTab === 'issues' ? issues : campaigns

  if (loading) {
    return (
      <div className="h-full w-full bg-[#080808] text-white flex items-center justify-center font-mono text-xs">
        <Loader2 className="w-4 h-4 animate-spin text-blue-400 mr-2" />
        CONNECTING TO GITLAB.HELLCORP.COM...
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-[#080808] text-white flex flex-col font-sans select-none overflow-hidden">
      {/* GitLab Header */}
      <div className="h-12 border-b border-white/[0.06] bg-black/40 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <FolderGit className="w-5 h-5 text-orange-500" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-orange-500">
            GitLab <span className="text-white/40">Hell Corp</span>
          </span>
        </div>

        {/* Global Work State Indicator */}
        {activeScenario ? (
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-sm uppercase tracking-wider animate-pulse">
              Working: {activeScenario.ticket.key}
            </span>
            <button
              onClick={handleMergePR}
              disabled={loadingId === activeScenario.id}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm cursor-pointer transition-colors"
            >
              {loadingId === activeScenario.id ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <GitMerge className="w-3 h-3" />
              )}
              Merge Pull Request
            </button>
          </div>
        ) : (
          <span className="font-mono text-[9px] text-emerald-400/80 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-sm uppercase tracking-wider">
            Idle Mode (Branch: main)
          </span>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Navigation Sidebar */}
        <aside className="w-44 border-r border-white/[0.06] bg-black/20 shrink-0 p-3 flex flex-col gap-1.5">
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/30 px-2 mb-2 block">
            Navigation
          </span>
          <button
            onClick={() => setActiveTab('issues')}
            className={`w-full text-left px-3 py-1.5 rounded-sm text-xs font-mono uppercase tracking-wider transition-colors ${
              activeTab === 'issues'
                ? 'bg-white/10 text-white font-bold'
                : 'text-white/50 hover:bg-white/[0.03] hover:text-white'
            }`}
          >
            Issues ({issues.length})
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`w-full text-left px-3 py-1.5 rounded-sm text-xs font-mono uppercase tracking-wider transition-colors ${
              activeTab === 'campaigns'
                ? 'bg-white/10 text-white font-bold'
                : 'text-white/50 hover:bg-white/[0.03] hover:text-white'
            }`}
          >
            Campaigns ({campaigns.length})
          </button>
        </aside>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 scrollbar-thin">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] mb-4">
            <h2 className="font-mono text-xs uppercase tracking-widest font-bold text-white/60">
              {activeTab === 'issues' ? 'Open Engineering Issues' : 'Strategic Campaigns'}
            </h2>
          </div>

          {itemsToRender.length === 0 ? (
            <div className="p-8 border border-dashed border-white/[0.06] text-center text-xs text-white/30 font-mono uppercase tracking-wider">
              No assignments available.
            </div>
          ) : (
            itemsToRender.map((item) => {
              const prog = progresses.find(p => p.scenario_id === item.id)
              const isCurrent = activeScenario?.id === item.id
              const isCompleted = prog?.status === 'completed'
              
              return (
                <div
                  key={item.id}
                  className={`p-4 bg-black/40 border rounded-sm transition-all ${
                    isCurrent
                      ? 'border-amber-500/40 ring-1 ring-amber-500/15'
                      : isCompleted
                        ? 'border-emerald-500/20 opacity-70'
                        : 'border-white/[0.06] hover:border-white/15'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-white/40">{item.ticket.key}</span>
                      <Badge variant="outline" className="text-[9px] font-mono rounded-sm h-4">
                        {item.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-[9px] font-mono rounded-sm h-4 capitalize">
                        {item.category}
                      </Badge>
                    </div>

                    {/* Status Badge */}
                    {isCurrent ? (
                      <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-amber-400">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        Active Branch
                      </span>
                    ) : isCompleted ? (
                      <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Merged
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono uppercase tracking-wider text-white/30">
                        Open
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-white/90 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed mb-4">{item.description}</p>

                  <div className="flex items-center justify-between border-t border-white/[0.04] pt-3">
                    <span className="text-[10px] text-white/30 font-mono">
                      EST. DURATION: ~{item.estimated_duration_minutes}m
                    </span>

                    {isCurrent ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            openWindow('ide')
                            openWindow('terminal')
                          }}
                          className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/15 text-[10px] font-mono uppercase tracking-wider rounded-sm cursor-pointer transition-colors"
                        >
                          <Code className="w-3 h-3" /> Open IDE
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartWork(item)}
                        disabled={loadingId !== null || activeScenario !== null}
                        className="flex items-center gap-1.5 px-3 py-1 bg-white text-black hover:bg-white/90 disabled:opacity-30 text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm cursor-pointer transition-colors"
                      >
                        {loadingId === item.id ? (
                          <Loader2 className="w-3 h-3 animate-spin text-black" />
                        ) : (
                          <Play className="w-2.5 h-2.5 fill-black" />
                        )}
                        {isCompleted ? 'Redo Assignment' : 'Assign & Start Work'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
