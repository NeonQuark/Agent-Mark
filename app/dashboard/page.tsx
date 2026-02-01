"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Code2, Twitter, Copy, Terminal, Eye, Loader2, Check, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CampaignResult {
  landingPageCode?: string;
  tweets?: string[];
  marketingAngle?: string;
}

export default function Dashboard() {
  const [idea, setIdea] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<CampaignResult | null>(null)
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'tweets'>('preview')
  const [copiedCode, setCopiedCode] = useState(false)

  const handleGenerate = async () => {
    if (!idea) return
    setIsGenerating(true)
    setResult(null)

    try {
      const response = await fetch('/api/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      })

      if (!response.ok) throw new Error('Generation failed')

      const data = await response.json()
      console.log('Received:', data)
      setResult(data)
    } catch (error) {
      console.error(error)
      alert('Generation failed. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyCode = () => {
    if (result?.landingPageCode) {
      navigator.clipboard.writeText(result.landingPageCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  // Generate preview HTML from React code
  const generatePreviewHTML = (code: string) => {
    return `<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { margin: 0; background: #09090b; color: white; font-family: system-ui, sans-serif; }</style>
</head><body>
  <div id="root"></div>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script type="text/babel">
    const Rocket = () => <span>🚀</span>;
    const Sparkles = () => <span>✨</span>;
    const ArrowRight = () => <span>→</span>;
    const Check = () => <span>✓</span>;
    const Star = () => <span>⭐</span>;
    const Zap = () => <span>⚡</span>;
    const Coffee = () => <span>☕</span>;
    const Camera = () => <span>📷</span>;
    const Code = () => <span>💻</span>;
    const Globe = () => <span>🌐</span>;
    const Mail = () => <span>📧</span>;
    const Shield = () => <span>🛡️</span>;
    const Heart = () => <span>❤️</span>;
    const Users = () => <span>👥</span>;
    const Target = () => <span>🎯</span>;
    const ChevronRight = () => <span>›</span>;
    const Menu = () => <span>☰</span>;
    const Phone = () => <span>📞</span>;
    const Clock = () => <span>🕐</span>;
    const Package = () => <span>📦</span>;
    const ShieldCheck = () => <span>🛡️</span>;
    const CreditCard = () => <span>💳</span>;
    const MapPin = () => <span>📍</span>;
    const Wifi = () => <span>📶</span>;
    
    try {
      ${code.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '').replace(/export\s+default\s+/g, 'const App = ')}
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App || LandingPage || MainComponent || Component));
    } catch(e) {
      document.getElementById('root').innerHTML = '<div style="padding:20px;color:#f87171;"><h2>Preview Error</h2><pre>' + e.message + '</pre></div>';
    }
  </script>
</body></html>`
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Launchpad
          </h1>
          <p className="text-sm text-zinc-500">Generate landing page + social content in one click.</p>
        </div>
        {result?.marketingAngle && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-2 text-xs font-mono text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20"
          >
            <Terminal className="h-3 w-3" />
            {result.marketingAngle}
          </motion.div>
        )}
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Input */}
        <div className="w-80 flex flex-col border-r border-zinc-800 bg-zinc-950/30 p-6">
          <label className="text-sm font-medium text-zinc-400 mb-2">What are we building?</label>
          <textarea
            className="w-full h-40 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-zinc-200 resize-none focus:ring-1 focus:ring-blue-500 outline-none text-sm placeholder:text-zinc-600"
            placeholder="E.g. A coffee shop with specialty brews..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !idea}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-500 h-12 text-base"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Rocket className="h-5 w-5 mr-2" />
                Launch
              </>
            )}
          </Button>
        </div>

        {/* Right Panel: Output */}
        <div className="flex-1 flex flex-col bg-[#0d1117]">
          {/* Tabs */}
          <div className="flex border-b border-zinc-800 bg-zinc-950/80">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'preview'
                  ? 'text-green-400 border-green-400 bg-green-500/5'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
                }`}
            >
              <Eye className="h-4 w-4" />
              Live Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'code'
                  ? 'text-blue-400 border-blue-400 bg-blue-500/5'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
                }`}
            >
              <Code2 className="h-4 w-4" />
              Code
            </button>
            <button
              onClick={() => setActiveTab('tweets')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'tweets'
                  ? 'text-sky-400 border-sky-400 bg-sky-500/5'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
                }`}
            >
              <Twitter className="h-4 w-4" />
              Social Posts ({result?.tweets?.length || 0})
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Rocket className="h-8 w-8 opacity-50" />
                </div>
                <p>Enter an idea and click Launch to get started</p>
              </div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full"
              >
                {activeTab === 'preview' && result.landingPageCode && (
                  <iframe
                    srcDoc={generatePreviewHTML(result.landingPageCode)}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts"
                    title="Preview"
                  />
                )}

                {activeTab === 'code' && (
                  <div className="p-6">
                    <div className="flex justify-end mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyCode}
                        className={copiedCode ? "text-green-400" : "text-zinc-400"}
                      >
                        {copiedCode ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                        {copiedCode ? "Copied!" : "Copy Code"}
                      </Button>
                    </div>
                    <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed bg-zinc-900/50 p-4 rounded-xl">
                      {result.landingPageCode}
                    </pre>
                  </div>
                )}

                {activeTab === 'tweets' && (
                  <div className="p-6 space-y-4">
                    {result.tweets?.map((tweet, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 transition-colors relative group"
                      >
                        {tweet}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-3 right-3 h-7 w-7 opacity-0 group-hover:opacity-100"
                          onClick={() => navigator.clipboard.writeText(tweet)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
