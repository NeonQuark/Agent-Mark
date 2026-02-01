"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Code2, Loader2, Copy, Check, Paintbrush, Eye } from "lucide-react"
import { HistoryPanel, useHistory } from "@/components/shared/history-panel"
import { TabbedOutput } from "@/components/shared/tabbed-output"

export default function DesignPage() {
    const [prompt, setPrompt] = useState("")
    const [result, setResult] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [activeTab, setActiveTab] = useState("preview")
    const [historyItems, setHistoryItems] = useState<any[]>([])

    const { getItems, addItem, deleteItem, clearAll } = useHistory('design-history')

    useEffect(() => {
        setHistoryItems(getItems())
    }, [])

    const handleGenerate = async () => {
        if (!prompt) return
        setIsLoading(true)
        setResult("")

        try {
            const response = await fetch('/api/design', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            })

            if (!response.ok) throw new Error('Failed to generate')

            const text = await response.text()
            setResult(text)
            const updated = addItem(prompt, text)
            setHistoryItems(updated)
        } catch (error) {
            console.error(error)
            alert('Generation failed.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(extractCode(result))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleHistorySelect = (item: any) => {
        setPrompt(item.input)
        if (item.result) {
            setResult(item.result)
        }
    }

    const handleHistoryDelete = (id: string) => {
        const updated = deleteItem(id)
        setHistoryItems(updated)
    }

    const handleHistoryClear = () => {
        clearAll()
        setHistoryItems([])
    }

    const extractCode = (text: string) => {
        const codeMatch = text.match(/```(?:jsx|tsx|javascript|react)?\n?([\s\S]*?)```/)
        return codeMatch ? codeMatch[1].trim() : text
    }

    const getPreviewHTML = () => {
        const code = extractCode(result)
        return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"></script>
<style>body{margin:0;background:#09090b;min-height:100vh;display:flex;align-items:center;justify-content:center;}</style></head><body><div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const ArrowRight=()=><span>→</span>;const Check=()=><span>✓</span>;const Star=()=><span>⭐</span>;
const Zap=()=><span>⚡</span>;const Code=()=><span>💻</span>;const Globe=()=><span>🌐</span>;
const Mail=()=><span>📧</span>;const Phone=()=><span>📞</span>;const PlayCircle=()=><span>▶️</span>;
try{${code.replace(/import\s+.*from\s+['"][^'"]+['"];?/g, '').replace(/export\s+default\s+/g, 'const App=')}
const root=ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App||HeroSection||MainComponent||Component));
}catch(e){document.getElementById('root').innerHTML='<div style="color:red;padding:20px">'+e.message+'</div>';}
</script></body></html>`
    }

    const tabs = [
        {
            id: 'preview',
            label: 'Live Preview',
            icon: <Eye className="h-4 w-4" />,
            content: (
                <iframe
                    srcDoc={getPreviewHTML()}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts"
                    title="Preview"
                />
            )
        },
        {
            id: 'code',
            label: 'Code',
            icon: <Code2 className="h-4 w-4" />,
            content: (
                <div className="p-4 h-full overflow-auto">
                    <div className="flex justify-end mb-2">
                        <Button variant="ghost" size="sm" onClick={handleCopy} className={copied ? "text-green-400" : "text-zinc-400"}>
                            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                            {copied ? "Copied!" : "Copy"}
                        </Button>
                    </div>
                    <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                        {extractCode(result)}
                    </pre>
                </div>
            )
        }
    ]

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-black text-white">
            <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur px-8 py-5">
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                    <Paintbrush className="h-6 w-6 text-purple-400" />
                    Web Designer
                </h1>
                <p className="text-sm text-zinc-500">Generate React + Tailwind components from descriptions.</p>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel */}
                <div className="w-80 flex flex-col border-r border-zinc-800 bg-zinc-950/30">
                    <div className="p-4 border-b border-zinc-800">
                        <label className="text-sm font-medium text-zinc-400 mb-2 block">Describe your component</label>
                        <textarea
                            className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-zinc-200 resize-none focus:ring-1 focus:ring-purple-500 outline-none text-sm placeholder:text-zinc-600"
                            placeholder="E.g. A modern hero section with gradient background..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <Button
                            onClick={handleGenerate}
                            disabled={isLoading || !prompt}
                            className="w-full mt-3 bg-purple-600 hover:bg-purple-500"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Code2 className="h-4 w-4 mr-2" />}
                            {isLoading ? "Generating..." : "Generate Component"}
                        </Button>
                    </div>

                    <div className="flex-1 overflow-auto p-4">
                        <HistoryPanel
                            items={historyItems}
                            onSelect={handleHistorySelect}
                            onDelete={handleHistoryDelete}
                            onClear={handleHistoryClear}
                        />
                    </div>
                </div>

                {/* Right Panel */}
                <div className="flex-1 p-4">
                    <TabbedOutput
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        hasContent={!!result}
                        emptyState={
                            <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                                <Paintbrush className="h-12 w-12 opacity-50" />
                                <p>Describe a component to generate code</p>
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    )
}
