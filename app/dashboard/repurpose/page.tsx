"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { FileText, ArrowRight, Loader2, Copy, Check, AlignLeft, Code2 } from "lucide-react"
import { HistoryPanel, useHistory } from "@/components/shared/history-panel"
import { TabbedOutput } from "@/components/shared/tabbed-output"

export default function RepurposePage() {
    const [content, setContent] = useState("")
    const [result, setResult] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [activeTab, setActiveTab] = useState("thread")
    const [historyItems, setHistoryItems] = useState<any[]>([])

    const { getItems, addItem, deleteItem, clearAll } = useHistory('repurpose-history')

    useEffect(() => {
        setHistoryItems(getItems())
    }, [])

    const handleRepurpose = async () => {
        if (!content) return
        setIsLoading(true)
        setResult("")

        try {
            const response = await fetch('/api/repurpose', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: content }),
            })

            if (!response.ok) throw new Error('Failed to generate')

            const text = await response.text()
            setResult(text)
            const updated = addItem(content.substring(0, 100), text)
            setHistoryItems(updated)
        } catch (error) {
            console.error(error)
            alert('Generation failed.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(result)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleHistorySelect = (item: any) => {
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

    // Parse thread into individual tweets
    const parseTweets = (text: string) => {
        return text.split(/\n(?=\d+[\/\.])/g).filter(t => t.trim())
    }

    const tabs = [
        {
            id: 'thread',
            label: 'Thread View',
            icon: <FileText className="h-4 w-4" />,
            content: (
                <div className="p-4 space-y-3 overflow-auto h-full">
                    {parseTweets(result).map((tweet, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 hover:border-zinc-700 relative group"
                        >
                            {tweet}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100"
                                onClick={() => navigator.clipboard.writeText(tweet)}
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                        </motion.div>
                    ))}
                </div>
            )
        },
        {
            id: 'raw',
            label: 'Raw Text',
            icon: <AlignLeft className="h-4 w-4" />,
            content: (
                <div className="p-4 h-full overflow-auto">
                    <div className="flex justify-end mb-2">
                        <Button variant="ghost" size="sm" onClick={handleCopy} className={copied ? "text-green-400" : "text-zinc-400"}>
                            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                            {copied ? "Copied!" : "Copy All"}
                        </Button>
                    </div>
                    <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                        {result}
                    </pre>
                </div>
            )
        }
    ]

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-black text-white">
            <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur px-8 py-5">
                <h1 className="text-2xl font-bold tracking-tight text-white">Content Repurposer</h1>
                <p className="text-sm text-zinc-500">Transform blog posts into viral Twitter threads.</p>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel */}
                <div className="w-80 flex flex-col border-r border-zinc-800 bg-zinc-950/30">
                    <div className="p-4 border-b border-zinc-800">
                        <label className="text-sm font-medium text-zinc-400 mb-2 block">Paste your content</label>
                        <textarea
                            className="w-full h-40 bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-zinc-200 resize-none focus:ring-1 focus:ring-blue-500 outline-none text-sm placeholder:text-zinc-600"
                            placeholder="Paste your article, blog post, or any text..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <Button
                            onClick={handleRepurpose}
                            disabled={isLoading || !content}
                            className="w-full mt-3 bg-blue-600 hover:bg-blue-500"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
                            {isLoading ? "Generating..." : "Generate Thread"}
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
                                <FileText className="h-12 w-12 opacity-50" />
                                <p>Paste content and generate a thread</p>
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    )
}
