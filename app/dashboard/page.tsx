"use client"

import { useState } from "react"
import { ProjectBrief } from "@/components/dashboard/project-brief"
import { motion } from "framer-motion"
import { Code2, Twitter, Copy, Terminal, Globe, Sparkles, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CampaignResult {
  landingPageCode?: string;
  tweets?: string[];
  marketingAngle?: string;
}

export default function Dashboard() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<CampaignResult | null>(null)
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'tweets'>('preview')

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
      try {
        const jsonMatch = fullText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          setResult(parsed)
        }
      } catch (parseError) {
        console.error('Parse error:', parseError)
        setResult({ landingPageCode: fullText, tweets: [] })
      }

    } catch (error) {
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate preview HTML from React code
  const generatePreviewHTML = (code: string) => {
    // Wrap the code in a full HTML document with Tailwind
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { margin: 0; background: #09090b; color: white; font-family: system-ui, sans-serif; }
    .icon { display: inline-block; width: 1em; height: 1em; background: currentColor; mask-size: contain; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    // Mock lucide-react icons
    const Rocket = () => <span>🚀</span>;
    const Sparkles = () => <span>✨</span>;
    const ArrowRight = () => <span>→</span>;
    const Check = () => <span>✓</span>;
    const Star = () => <span>⭐</span>;
    const Zap = () => <span>⚡</span>;
    const Code = () => <span>💻</span>;
    const Globe = () => <span>🌐</span>;
    const Mail = () => <span>📧</span>;
    const Phone = () => <span>📞</span>;
    const MapPin = () => <span>📍</span>;
    const Clock = () => <span>🕐</span>;
    const Package = () => <span>📦</span>;
    const Target = () => <span>🎯</span>;
    const Flame = () => <span>🔥</span>;
    const Leaf = () => <span>🌿</span>;
    const Drone = () => <span>🛸</span>;
    const Pizza = () => <span>🍕</span>;
    const MousePointerClick = () => <span>👆</span>;
    
    try {
      ${code.replace(/^import.*$/gm, '// import removed').replace(/export default /g, 'const MainComponent = ')}
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<MainComponent />);
    } catch (e) {
      document.getElementById('root').innerHTML = '<div style="padding: 20px; color: #f87171;"><h2>Preview Error</h2><pre>' + e.message + '</pre></div>';
    }
  </script>
</body>
</html>`;
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
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'preview'
                    ? 'text-green-400 border-b-2 border-green-400'
                    : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                <Eye className="h-4 w-4" />
                Live Preview
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'code'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                <Code2 className="h-4 w-4" />
                Code
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

              {/* Live Preview Tab */}
              {activeTab === 'preview' && (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Globe className="h-4 w-4" />
                      <span className="font-mono">Preview</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-red-500/50" />
                      <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                      <div className="h-2 w-2 rounded-full bg-green-500/50" />
                    </div>
                  </div>
                  <div className="flex-1 bg-[#09090b]">
                    {result?.landingPageCode ? (
                      <iframe
                        srcDoc={generatePreviewHTML(result.landingPageCode)}
                        className="w-full h-full border-0"
                        sandbox="allow-scripts"
                        title="Landing Page Preview"
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                          <Eye className="h-8 w-8 opacity-50" />
                        </div>
                        <p className="text-sm">Live preview will appear here...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Code Tab */}
              {activeTab === 'code' && (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Code2 className="h-4 w-4" />
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
                  <div className="flex-1 overflow-auto p-4 bg-[#0d1117]">
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

              {/* Tweets Tab */}
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
