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

  // Parse the data to extract the Headline and Subheader
  const headlineMatch = data?.match(/\*\*Headline:\*\*\s*(.*)/) || data?.match(/Headline:\s*(.*)/);
  const subheaderMatch = data?.match(/\*\*Subheader:\*\*\s*(.*)/) || data?.match(/Subheader:\s*(.*)/);

  const headline = headlineMatch ? headlineMatch[1].trim() : "Generating your landing page...";
  const subheader = subheaderMatch ? subheaderMatch[1].trim() : "Our AI is crafting the perfect value proposition for your launch.";

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

        {/* Landing Page Content - Visual Render */}
        <div className="p-0">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950/30 px-8 py-20 text-center">

            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

            <div className="relative mx-auto max-w-2xl">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                AI Generated Preview
              </div>

              {/* Dynamic Headline */}
              <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {headline}
              </h1>

              {/* Dynamic Subheader */}
              <p className="mb-10 text-balance text-lg text-zinc-400 leading-relaxed">
                {subheader}
              </p>

              {/* Waitlist Form Mockup */}
              <div className="mx-auto flex max-w-sm flex-col gap-3 sm:flex-row">
                <Input
                  disabled
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500"
                />
                <Button disabled className="bg-blue-600 text-white hover:bg-blue-700">
                  Join Waitlist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <p className="mt-8 text-xs text-zinc-600">
                * This is a preview based on your prompt.
              </p>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  )
}
