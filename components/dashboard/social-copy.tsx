"use client"

import { Button } from "@/components/ui/button"
import { Copy, Check, Twitter, MessageCircle } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { SpotlightCard } from "@/components/ui/spotlight-card"

interface SocialCopyProps {
  isGenerated: boolean
  data?: string
}

const tweetDrafts = [
  {
    id: 1,
    content:
      "Tired of sad desk lunches? We're building something exciting for tech workers who want healthy, plant-based meals delivered fresh.\n\nNo more decision fatigue. No more settling.\n\nJoin the waitlist",
  },
  {
    id: 2,
    content:
      "Hot take: Your lunch shouldn't require a 30-minute break just to find something healthy.\n\nWe're solving meal prep for busy devs in Bangalore. Vegan. Fresh. Delivered.\n\nEarly access launching soon",
  },
  {
    id: 3,
    content:
      "Building in public\n\nProblem: Tech workers skip meals or eat junk\nSolution: Subscription meal prep, fully vegan\nMarket: 500K+ tech workers in Bangalore\n\nShipping MVP next month. Who wants early access?",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
}

export function SocialCopy({ isGenerated, data }: SocialCopyProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const handleCopy = async (id: number, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!isGenerated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/50 p-8"
      >
        <MessageCircle className="mb-4 h-12 w-12 text-zinc-700" />
        <p className="text-center text-sm text-zinc-500">
          Your social media copy will appear here after generation
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {data ? (
        <SpotlightCard className="border-zinc-800 bg-zinc-950">
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                  <MessageCircle className="h-4 w-4 text-blue-400" />
                </div>
                <p className="text-sm font-medium text-white">Campaign Output</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => {
                if (data) navigator.clipboard.writeText(data)
              }}>
                <Copy className="h-4 w-4 mr-2" /> Copy All
              </Button>
            </div>
            <div className="whitespace-pre-wrap text-zinc-300 font-mono text-sm leading-relaxed max-h-[500px] overflow-y-auto">
              {data}
            </div>
          </div>
        </SpotlightCard>
      ) : (
        /* Fallback if no data but isGenerated is true (shouldn't happen often) */
        <div className="text-zinc-500 text-center">No content generated.</div>
      )}
    </motion.div>
  )
}
