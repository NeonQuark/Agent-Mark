"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LandingPreview } from "./landing-preview"
import { SocialCopy } from "./social-copy"
import { Globe, MessageSquare } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface OutputPanelProps {
  isGenerated: boolean
  campaignData?: string
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

export function OutputPanel({ isGenerated, campaignData }: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState("landing")
  const [direction, setDirection] = useState(0)

  const handleTabChange = (value: string) => {
    setDirection(value === "social" ? 1 : -1)
    setActiveTab(value)
  }

  return (
    <div className="h-full">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4 w-full justify-start gap-1 border border-zinc-800 bg-zinc-950 p-1">
          <TabsTrigger
            value="landing"
            className="flex items-center gap-2 text-zinc-400 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
          >
            <Globe className="h-4 w-4" />
            Landing Page Preview
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="flex items-center gap-2 text-zinc-400 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
          >
            <MessageSquare className="h-4 w-4" />
            Social Drafts
          </TabsTrigger>
        </TabsList>

        <div className="relative min-h-[500px] overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeTab}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="w-full"
            >
              {activeTab === "landing" ? (
                <LandingPreview isGenerated={isGenerated} data={campaignData} />
              ) : (
                <SocialCopy isGenerated={isGenerated} data={campaignData} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  )
}
