"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, User, Bot, ChevronRight, CheckCircle2, Info, PlayCircle } from "lucide-react"

type Message = {
  id: string
  sender: "elena" | "user"
  text: string
  timestamp: Date
  actions?: { label: string; onClick: () => void; primary?: boolean }[]
  videoUrl?: string
}

const TOUR_STEPS = [
  {
    id: "welcome",
    text: "Welcome aboard! I'm Elena from Engineering Operations. I'll be your guide for your first few minutes here in Praxis OS.",
    nextText: "Let's start the tour"
  },
  {
    id: "purpose",
    text: "Praxis isn't just a platform; it's a high-fidelity workspace where you'll solve real tickets, interact with an AI-driven team, and prove your seniority.",
    nextText: "Where do I start?"
  },
  {
    id: "apps",
    text: "Take a look at your taskbar and desktop. You have Mail.exe for internal comms, a Browser for documentation and mission picking, and a Terminal for the actual work.",
    nextText: "Got it, what else?",
    showHow: true,
    howVideo: "/videos/tour/apps-overview.mp4"
  },
  {
    id: "customization",
    text: "You can customize your experience in Settings.exe. Change the OS theme, font, and even the workspace 'wrapping' to suit your focus style.",
    nextText: "Ready to work",
    showHow: true,
    howVideo: "/videos/tour/customization-guide.mp4"
  },
  {
    id: "final",
    text: "Excellent. I've sent a welcome mission to your Browser. Open it when you're ready to pick up your first ticket. Good luck!",
    nextText: "Finish Tour"
  }
]

export default function TourChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)

  const addMessage = useCallback((sender: "elena" | "user", text: string, actions?: any[], videoUrl?: string) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender,
      text,
      timestamp: new Date(),
      actions,
      videoUrl
    }
    setMessages(prev => [...prev, newMessage])
  }, [])

  const triggerStep = useCallback((index: number) => {
    if (index >= TOUR_STEPS.length) return
    
    setIsTyping(true)
    const step = TOUR_STEPS[index]
    
    setTimeout(() => {
      setIsTyping(false)
      
      const actions = [
        { 
          label: step.nextText, 
          primary: true,
          onClick: () => {
            addMessage("user", step.nextText)
            triggerStep(index + 1)
          } 
        }
      ]

      if (step.showHow) {
        actions.unshift({
          label: "Show me how",
          primary: false,
          onClick: () => {
            addMessage("user", "Show me how")
            setIsTyping(true)
            
            setTimeout(() => {
              setIsTyping(false)
              addMessage(
                "elena", 
                "Here is a quick demonstration of the tools at your disposal:", 
                [{ 
                  label: "Got it, continue", 
                  primary: true,
                  onClick: () => {
                    addMessage("user", "Got it, continue")
                    triggerStep(index + 1)
                  }
                }], 
                step.howVideo || "/tour-demo.mp4"
              )
            }, 1000)
          }
        })
      }

      addMessage("elena", step.text, actions)
      setCurrentStepIndex(index)
    }, 1500)
  }, [addMessage])

  useEffect(() => {
    if (!hasInitialized.current) {
      triggerStep(0)
      hasInitialized.current = true
    }
  }, [triggerStep])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, isTyping])

  return (
    <div className="flex flex-col h-full bg-[#050505] text-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05] bg-white/[0.01]">
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-[#a86f44]/20 border border-[#a86f44]/40 flex items-center justify-center">
            <User size={20} className="text-[#a86f44]" />
          </div>
          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-black" />
        </div>
        <div>
          <h3 className="text-sm font-medium">Elena</h3>
          <p className="text-[10px] text-emerald-500/70 font-mono uppercase tracking-widest">Engineering Operations</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            // Only show actions for the absolute latest message that has them
            const isLatestWithActions = messages.filter(m => m.actions && m.actions.length > 0).pop()?.id === msg.id

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`
                    p-4 rounded-sm text-sm leading-relaxed
                    ${msg.sender === "user" 
                      ? "bg-[#a86f44] text-white" 
                      : "bg-white/[0.03] border border-white/[0.08] text-white/90"}
                  `}>
                    {msg.text}
                    
                    {msg.videoUrl && (
                      <div className="mt-4 rounded-sm overflow-hidden border border-white/10 aspect-video bg-black flex items-center justify-center relative group cursor-pointer">
                        <video 
                          src={msg.videoUrl} 
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-all">
                          <PlayCircle size={32} className="text-white opacity-60" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {msg.sender === "elena" && msg.actions && msg.actions.length > 0 && isLatestWithActions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.actions.map((action, i) => (
                        <button
                          key={i}
                          onClick={action.onClick}
                          className={`
                            flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-medium transition-all cursor-pointer group
                            ${action.primary 
                              ? "bg-white/[0.05] border border-white/[0.1] hover:bg-[#a86f44]/20 hover:border-[#a86f44]/40" 
                              : "bg-transparent text-white/40 hover:text-white"}
                          `}
                        >
                          {action.label}
                          {action.primary && <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <span className="mt-1.5 text-[9px] font-mono text-white/20 uppercase tracking-widest">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            )
          })}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/[0.03] border border-white/[0.08] px-4 py-3 rounded-sm flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '200ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '400ms' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area (Disabled during tour) */}
      <div className="p-6 border-t border-white/[0.05] bg-white/[0.01]">
        <div className="relative flex items-center">
          <input 
            type="text"
            disabled
            placeholder="Type a message..."
            className="w-full h-12 bg-white/[0.03] border border-white/[0.08] rounded-sm pl-4 pr-12 text-sm text-white/40 cursor-not-allowed"
          />
          <div className="absolute right-3 p-2 text-white/10">
            <Send size={18} />
          </div>
        </div>
        <p className="mt-3 flex items-center gap-2 text-[10px] text-white/20 font-mono uppercase tracking-widest text-center justify-center">
          <Info size={12} />
          Follow Elena's instructions to progress
        </p>
      </div>
    </div>
  )
}
