"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Code2, Loader2, Copy, Check, Paintbrush, Home, ShoppingCart, Package, Eye, Smartphone, Tablet, Monitor, Pencil } from "lucide-react"
import { DownloadButton } from "@/components/dashboard/download-button"

interface DesignResult {
    homePage?: string;
    productPage?: string;
    cartPage?: string;
}

export default function DesignPage() {
    const [prompt, setPrompt] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<DesignResult | null>(null)
    const [activeTab, setActiveTab] = useState<'home' | 'product' | 'cart'>('home')
    const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')
    const [copiedCode, setCopiedCode] = useState(false)
    const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
    const [isLiveEditing, setIsLiveEditing] = useState(false)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    // Listen for messages from preview iframe
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (typeof event.data === 'string' && event.data.startsWith('switch-tab:')) {
                const newTab = event.data.split(':')[1] as 'home' | 'product' | 'cart';
                setActiveTab(newTab);
            }
        };
        if (typeof window !== 'undefined') window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    // Toggle Live Editing
    useEffect(() => {
        if (iframeRef.current && iframeRef.current.contentDocument) {
            iframeRef.current.contentDocument.designMode = isLiveEditing ? 'on' : 'off';
        }
    }, [isLiveEditing, activeTab, result]);

    const handleGenerate = async () => {
        if (!prompt) return
        setIsLoading(true)
        setResult(null)

        try {
            const response = await fetch('/api/design', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            })

            if (!response.ok) throw new Error('Generation failed')

            const data = await response.json()
            setResult(data)
        } catch (error) {
            console.error(error)
            alert('Generation failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const getCurrentCode = () => {
        if (!result) return ''
        switch (activeTab) {
            case 'home': return result.homePage || ''
            case 'product': return result.productPage || ''
            case 'cart': return result.cartPage || ''
        }
    }

    const handleCopyCode = () => {
        navigator.clipboard.writeText(getCurrentCode())
        setCopiedCode(true)
        setTimeout(() => setCopiedCode(false), 2000)
    }

    // Clean and render code in preview
    const generatePreviewHTML = (code: string) => {
        // Clean imports and exports
        let cleaned = code.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?\n?/g, '')
        cleaned = cleaned.replace(/export\s+default\s+function\s+(\w+)/g, 'function $1')
        cleaned = cleaned.replace(/export\s+default\s+/g, 'const MainComponent = ')

        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; background: #09090b; color: white; font-family: system-ui, -apple-system, sans-serif; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    a { text-decoration: none; color: inherit; }
    /* Visual cue for editable mode */
    [contenteditable="true"]:hover { outline: 1px dashed #3b82f6; cursor: text; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script type="text/babel">
    // Add click handler for navigation
    window.addEventListener('click', (e) => {
      // Don't navigate if editing
      if (document.designMode === 'on') {
        e.preventDefault();
        return;
      }
      
      const target = e.target;
      if (target.tagName === 'A' || target.tagName === 'BUTTON') {
        const text = target.innerText.toLowerCase();
        if (text.includes('home')) window.parent.postMessage('switch-tab:home', '*');
        if (text.includes('product') || text.includes('shop')) window.parent.postMessage('switch-tab:product', '*');
        if (text.includes('cart') || text.includes('checkout')) window.parent.postMessage('switch-tab:cart', '*');
      }
    });

    try {
      ${cleaned}
      
      const componentNames = ['HomePage', 'ProductPage', 'CartPage', 'CheckoutPage', 'LandingPage', 
        'MainComponent', 'App', 'Page', 'Home', 'Product', 'Cart', 'Checkout'];
      let Component = null;
      for (const name of componentNames) {
        if (typeof window[name] !== 'undefined') {
          Component = window[name];
          break;
        }
        try {
          Component = eval(name);
          if (Component) break;
        } catch(e) {}
      }
      
      if (Component) {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(Component));
      } else {
        document.getElementById('root').innerHTML = '<div style="padding:40px;text-align:center;color:#fbbf24;"><h2>⚠️ Component not found</h2><p style="color:#a1a1aa;">Could not find a React component to render.</p></div>';
      }
    } catch(e) {
      console.error('Preview error:', e);
      document.getElementById('root').innerHTML = '<div style="padding:40px;color:#f87171;"><h2>Preview Error</h2><pre style="white-space:pre-wrap;color:#a1a1aa;">' + e.message + '</pre></div>';
    }
  </script>
</body>
</html>`
    }

    const tabs = [
        { id: 'home' as const, label: 'Home Page', icon: Home },
        { id: 'product' as const, label: 'Product Page', icon: Package },
        { id: 'cart' as const, label: 'Cart / Checkout', icon: ShoppingCart },
    ]

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-black text-white">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur px-8 py-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                            <Paintbrush className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">
                                Web Designer <span className="text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-0.5 rounded-full ml-2">PRO</span>
                            </h1>
                            <p className="text-sm text-zinc-500">Generate a complete e-commerce website with 3 pages</p>
                        </div>
                    </div>
                    {result && <DownloadButton result={result} prompt={prompt} />}
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Input */}
                <div className="w-80 flex flex-col border-r border-zinc-800 bg-zinc-950/30 p-6">
                    <label className="text-sm font-medium text-zinc-400 mb-2">Describe your store</label>
                    <textarea
                        className="w-full h-40 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-zinc-200 resize-none focus:ring-1 focus:ring-pink-500 outline-none text-sm placeholder:text-zinc-600"
                        placeholder="E.g. A modern sneaker store with dark theme..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <Button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt}
                        className="w-full mt-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 h-12 text-base"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                Generating 3 pages...
                            </>
                        ) : (
                            <>
                                <Paintbrush className="h-5 w-5 mr-2" />
                                Generate Website
                            </>
                        )}
                    </Button>

                    {result && (
                        <div className="mt-6 space-y-2">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Pages</p>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                                            ? 'bg-zinc-800 text-white border border-zinc-700'
                                            : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300 border border-transparent'
                                        }`}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Panel: Output */}
                <div className="flex-1 flex flex-col bg-[#0d1117]">
                    {/* Toolbar */}
                    {result && (
                        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 h-14">
                            {/* View Toggle */}
                            <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('preview')}
                                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === 'preview' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                                        }`}
                                >
                                    <Eye className="h-3 w-3" /> Preview
                                </button>
                                <button
                                    onClick={() => setViewMode('code')}
                                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === 'code' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                                        }`}
                                >
                                    <Code2 className="h-3 w-3" /> Code
                                </button>
                            </div>

                            {/* Center Tools (Live Edit & Devices) */}
                            {viewMode === 'preview' && (
                                <div className="flex items-center gap-4">
                                    {/* Device Toggles */}
                                    <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-lg">
                                        <button onClick={() => setDevice('mobile')} className={`p-1.5 rounded-md ${device === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><Smartphone className="h-4 w-4" /></button>
                                        <button onClick={() => setDevice('tablet')} className={`p-1.5 rounded-md ${device === 'tablet' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><Tablet className="h-4 w-4" /></button>
                                        <button onClick={() => setDevice('desktop')} className={`p-1.5 rounded-md ${device === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><Monitor className="h-4 w-4" /></button>
                                    </div>

                                    {/* Live Edit Toggle */}
                                    <button
                                        onClick={() => setIsLiveEditing(!isLiveEditing)}
                                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${isLiveEditing
                                                ? 'bg-green-500/10 text-green-400 border-green-500/50 animate-pulse'
                                                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                                            }`}
                                    >
                                        <Pencil className="h-3 w-3" />
                                        {isLiveEditing ? 'Live Editing ON' : 'Edit Text'}
                                    </button>
                                </div>
                            )}

                            {/* Copy Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopyCode}
                                className={copiedCode ? "text-green-400" : "text-zinc-400"}
                            >
                                {copiedCode ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                {copiedCode ? "Copied" : "Copy Code"}
                            </Button>
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="flex-1 overflow-hidden relative flex justify-center bg-[#0d1117]">
                        {!result ? (
                            <div className="h-full w-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                                <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                    <Paintbrush className="h-8 w-8 opacity-50" />
                                </div>
                                <p>Describe your store and click Generate</p>
                                <p className="text-sm text-zinc-700">Get 3 full pages + Export to ZIP</p>
                            </div>
                        ) : (
                            <motion.div
                                key={`${activeTab}-${viewMode}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`h-full transition-all duration-300 ease-in-out ${viewMode === 'code' ? 'w-full' :
                                        device === 'mobile' ? 'w-[375px]' :
                                            device === 'tablet' ? 'w-[768px]' :
                                                'w-full'
                                    }`}
                            >
                                {viewMode === 'preview' ? (
                                    <iframe
                                        ref={iframeRef}
                                        srcDoc={generatePreviewHTML(getCurrentCode())}
                                        className={`w-full h-full border-0 bg-white ${device !== 'desktop' ? 'my-4 rounded-xl shadow-2xl border border-zinc-800' : ''}`}
                                        sandbox="allow-scripts allow-modals"
                                        title={`${activeTab} Preview`}
                                    />
                                ) : (
                                    <pre className="p-6 h-full overflow-auto font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                        {getCurrentCode()}
                                    </pre>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
