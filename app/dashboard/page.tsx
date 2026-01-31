
"use client"

import { useState } from "react"
import { ProjectBrief } from "@/components/dashboard/project-brief"
import { OutputPanel } from "@/components/dashboard/output-panel"
import { motion } from "framer-motion"

export default function Dashboard() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [campaignData, setCampaignData] = useState("")

  const handleGenerate = async (idea: string, vibe: string) => {
    setIsGenerating(true)
    setIsGenerated(false)
    setCampaignData("")

    try {
      const response = await fetch('/api/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, vibe }),
      })

      if (!response.ok) throw new Error('Generation failed')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          setCampaignData(prev => prev + chunk)
        }
      }
      setIsGenerated(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-black/95 px-8 py-5 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              New Launch
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Generate landing pages and social campaigns in seconds
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
              AI Ready
            </span>
          </motion.div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left Column - Input */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <ProjectBrief
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </motion.div>

          {/* Right Column - Output */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <OutputPanel isGenerated={isGenerated} campaignData={campaignData} />
          </motion.div>
        </div>
      </div>
    </>
  )
}
