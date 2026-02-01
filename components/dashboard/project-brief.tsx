"use client"

import { Label } from "@/components/ui/label"
import { Sparkles, FileText, Rocket } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { Button } from "@/components/ui/button"

interface ProjectBriefProps {
  onGenerate: (idea: string) => void
  isGenerating: boolean
}

export function ProjectBrief({ onGenerate, isGenerating }: ProjectBriefProps) {
  const [idea, setIdea] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  return (
    <SpotlightCard className="border-zinc-800 bg-zinc-950">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
            <Rocket className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-white">Launch Your Business</h2>
        </div>

        <div className="space-y-5">
          {/* Idea Textarea with glow effect */}
          <div className="space-y-2">
            <Label htmlFor="idea" className="text-sm font-medium text-zinc-300">
              Describe Your Business Idea
            </Label>
            <motion.div
              animate={{
                boxShadow: isFocused
                  ? "0 0 0 2px rgba(59, 130, 246, 0.3), 0 0 40px -5px rgba(59, 130, 246, 0.3)"
                  : "0 0 0 1px rgba(63, 63, 70, 1)",
              }}
              transition={{ duration: 0.2 }}
              className="rounded-lg"
            >
              <textarea
                id="idea"
                placeholder="E.g., A cyberpunk-themed coffee shop that specializes in 3D printed latte art..."
                className="min-h-[180px] w-full resize-none rounded-lg border-0 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-0"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </motion.div>
            <p className="text-xs text-zinc-500">
              Be specific! Include your target audience, unique selling points, and any style preferences.
            </p>
          </div>

          {/* Generate Button */}
          <Button
            onClick={() => {
              if (!idea.trim()) return;
              onGenerate(idea)
            }}
            disabled={isGenerating || !idea.trim()}
            className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="mr-2"
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
                Building Your Launch...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Landing Page & Posts
              </>
            )}
          </Button>
        </div>
      </div>
    </SpotlightCard>
  )
}
