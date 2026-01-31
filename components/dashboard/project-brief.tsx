"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sparkles, FileText } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { ShimmerButton } from "@/components/ui/shimmer-button"

interface ProjectBriefProps {
  onGenerate: (idea: string, vibe: string) => void
  isGenerating: boolean
}

export function ProjectBrief({ onGenerate, isGenerating }: ProjectBriefProps) {
  const [idea, setIdea] = useState("")
  const [vibe, setVibe] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  return (
    <SpotlightCard className="border-zinc-800 bg-zinc-950">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20">
            <FileText className="h-4 w-4 text-blue-500" />
          </div>
          <h2 className="text-lg font-semibold text-white">Project Brief</h2>
        </div>

        <div className="space-y-5">
          {/* Idea Textarea with glow effect */}
          <div className="space-y-2">
            <Label htmlFor="idea" className="text-sm font-medium text-zinc-300">
              Your Idea
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
                placeholder="Describe your idea (e.g., A vegan meal prep service for tech workers in Bangalore)..."
                className="min-h-[160px] w-full resize-none rounded-lg border-0 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-0"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </motion.div>
          </div>

          {/* Vibe Select */}
          <div className="space-y-2">
            <Label htmlFor="vibe" className="text-sm font-medium text-zinc-300">
              Vibe
            </Label>
            <Select value={vibe} onValueChange={setVibe}>
              <SelectTrigger
                id="vibe"
                className="border-zinc-800 bg-zinc-900 text-white focus:ring-blue-500/30"
              >
                <SelectValue placeholder="Select a vibe" />
              </SelectTrigger>
              <SelectContent className="border-zinc-800 bg-zinc-900">
                <SelectItem value="professional" className="text-zinc-200 focus:bg-zinc-800 focus:text-white">
                  Professional
                </SelectItem>
                <SelectItem value="playful" className="text-zinc-200 focus:bg-zinc-800 focus:text-white">
                  Playful
                </SelectItem>
                <SelectItem value="urgent" className="text-zinc-200 focus:bg-zinc-800 focus:text-white">
                  Urgent
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button with shimmer */}
          <ShimmerButton
            onClick={() => onGenerate(idea, vibe)}
            disabled={isGenerating || !idea || !vibe}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Campaign
              </>
            )}
          </ShimmerButton>
        </div>
      </div>
    </SpotlightCard>
  )
}
