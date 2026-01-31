"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Globe } from "lucide-react"
import { motion } from "framer-motion"
import { SpotlightCard } from "@/components/ui/spotlight-card"

interface LandingPreviewProps {
  isGenerated: boolean
  data?: string
}

export function LandingPreview({ isGenerated, data }: LandingPreviewProps) {
  if (!isGenerated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/50 p-8"
      >
        <Globe className="mb-4 h-12 w-12 text-zinc-700" />
        <p className="text-center text-sm text-zinc-500">
          Your landing page preview will appear here after generation
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <SpotlightCard className="overflow-hidden border-zinc-800 bg-zinc-950">
        {/* Browser Chrome */}
        <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/50 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <div className="h-3 w-3 rounded-full bg-green-500/60" />
          </div>
          <div className="ml-4 flex-1 rounded-md bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
            marketing-campaign.generated_by_ai.com
          </div>
        </div>

        {/* Landing Page Content */}
        <div className="p-8 max-h-[600px] overflow-y-auto">
          {data ? (
            <div className="prose prose-invert prose-blue max-w-none">
              <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-zinc-300">
                {data}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold text-white mb-2">Campaign Generated!</h3>
              <p className="text-zinc-500">Check the "Social Drafts" tab for tweets, or see the raw structure above.</p>
            </div>
          )}
        </div>
      </SpotlightCard>
    </motion.div>
  )
}
