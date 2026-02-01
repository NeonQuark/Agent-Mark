"use client"

import { useState } from "react"
import { ProjectBrief } from "@/components/dashboard/project-brief"
import { motion } from "framer-motion"
import { Code2, Twitter, Copy, Terminal, Globe, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CampaignResult {
  landingPageCode?: string;
  tweets?: string[];
  marketingAngle?: string;
}

export default function Dashboard() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<CampaignResult | null>(null)
  const [activeTab, setActiveTab] = useState<'code' | 'tweets'>('code')

  const handleGenerate = async (idea: string) => {
    setIsGenerating(true)
    setResult(null)

    try {
      const response = await fetch('/api/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      })

      if (!response.ok) throw new Error('Generation failed')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          fullText += decoder.decode(value, { stream: true })
        }
      }

      // Parse the streamed JSON (Vercel AI SDK format)
      // The format is like: 0:"partial" 0:"json" ...
      // We need to extract the final object
      try {
        // Try to find JSON in the response
        const jsonMatch = fullText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          setResult(parsed)
        }
      } catch (parseError) {
        console.error('Parse error:', parseError)
        // Fallback: show raw text
        setResult({ landingPageCode: fullText, tweets: [] })
      }

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
            <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-400" />
              Launchpad
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Generate landing page code & social content instantly
            </p>
          </motion.div>
          {result?.marketingAngle && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden md:flex items-center gap-2 text-xs font-mono text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20"
            >
              <Terminal className="h-3 w-3" />
              {result.marketingAngle}
            </motion.div>
          )}
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-8 h-[calc(100vh-100px)] overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-5 h-full">
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
            className="lg:col-span-3 flex flex-col h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {/* Tab Headers */}
            <div className="flex border-b border-zinc-800 mb-4">
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'code'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                <Code2 className="h-4 w-4" />
                Landing Page Code
              </button>
              <button
                onClick={() => setActiveTab('tweets')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'tweets'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                <Twitter className="h-4 w-4" />
                Social Posts ({result?.tweets?.length || 0})
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden relative">
              {/* Grid effect */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

              {activeTab === 'code' && (
                <div className="h-full flex flex-col">
                  {/* Code Header */}
                  <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Globe className="h-4 w-4" />
                      <span className="font-mono">LandingPage.tsx</span>
                    </div>
                    {result?.landingPageCode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-zinc-400 hover:text-white"
                        onClick={() => navigator.clipboard.writeText(result.landingPageCode || '')}
                      >
                        <Copy className="h-4 w-4 mr-2" /> Copy
                      </Button>
                    )}
                  </div>
                  {/* Code Content */}
                  <div className="flex-1 overflow-auto p-4">
                    {result?.landingPageCode ? (
                      <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                        {result.landingPageCode}
                      </pre>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                          <Code2 className="h-8 w-8 opacity-50" />
                        </div>
                        <p className="text-sm">Your landing page code will appear here...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'tweets' && (
                <div className="h-full overflow-auto p-4">
                  {result?.tweets && result.tweets.length > 0 ? (
                    <div className="space-y-3">
                      {result.tweets.map((tweet, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 hover:border-zinc-700 transition-colors relative group"
                        >
                          {tweet}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => navigator.clipboard.writeText(tweet)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                        <Twitter className="h-8 w-8 opacity-50" />
                      </div>
                      <p className="text-sm">Social media posts will appear here...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
