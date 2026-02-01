"use client"

import { useState, useEffect } from "react"
import { Clock, Trash2, Eye, Code2, Twitter, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface HistoryItem {
    id: string
    type: 'campaign' | 'repurpose' | 'design' | 'seo'
    input: string
    timestamp: number
    result?: any
}

export default function HistoryPage() {
    const [items, setItems] = useState<HistoryItem[]>([])
    const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)

    useEffect(() => {
        loadHistory()
    }, [])

    const loadHistory = () => {
        const allItems: HistoryItem[] = []

        // Load from all history keys
        const keys = ['campaign-history', 'repurpose-history', 'design-history', 'seo-history']
        keys.forEach(key => {
            try {
                const stored = localStorage.getItem(key)
                if (stored) {
                    const parsed = JSON.parse(stored)
                    const type = key.replace('-history', '') as HistoryItem['type']
                    parsed.forEach((item: any) => {
                        allItems.push({ ...item, type })
                    })
                }
            } catch (e) { }
        })

        // Sort by timestamp descending
        allItems.sort((a, b) => b.timestamp - a.timestamp)
        setItems(allItems)
    }

    const deleteItem = (id: string, type: string) => {
        const key = `${type}-history`
        try {
            const stored = localStorage.getItem(key)
            if (stored) {
                const parsed = JSON.parse(stored)
                const filtered = parsed.filter((item: any) => item.id !== id)
                localStorage.setItem(key, JSON.stringify(filtered))
                loadHistory()
                if (selectedItem?.id === id) setSelectedItem(null)
            }
        } catch (e) { }
    }

    const clearAll = () => {
        if (confirm('Clear all history? This cannot be undone.')) {
            localStorage.removeItem('campaign-history')
            localStorage.removeItem('repurpose-history')
            localStorage.removeItem('design-history')
            localStorage.removeItem('seo-history')
            setItems([])
            setSelectedItem(null)
        }
    }

    const typeLabels = {
        campaign: { label: 'Launchpad', color: 'text-blue-400 bg-blue-500/10' },
        repurpose: { label: 'Repurpose', color: 'text-purple-400 bg-purple-500/10' },
        design: { label: 'Web Designer', color: 'text-pink-400 bg-pink-500/10' },
        seo: { label: 'SEO Brief', color: 'text-green-400 bg-green-500/10' },
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-black text-white">
            <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur px-8 py-5 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Clock className="h-6 w-6 text-zinc-400" />
                        History
                    </h1>
                    <p className="text-sm text-zinc-500">View and manage your past generations.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={loadHistory} className="text-zinc-400">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    {items.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearAll} className="text-red-400 hover:text-red-300">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear All
                        </Button>
                    )}
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* History List */}
                <div className="w-96 border-r border-zinc-800 overflow-auto p-4 space-y-2">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-600">
                            <Clock className="h-12 w-12 mb-4 opacity-50" />
                            <p>No history yet</p>
                            <p className="text-sm mt-2">Generate content to see it here</p>
                        </div>
                    ) : (
                        items.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.02 }}
                                onClick={() => setSelectedItem(item)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all group ${selectedItem?.id === item.id
                                        ? 'bg-zinc-800 border-zinc-600'
                                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${typeLabels[item.type].color}`}>
                                        {typeLabels[item.type].label}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            deleteItem(item.id, item.type)
                                        }}
                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                                <p className="text-sm text-zinc-300 line-clamp-2">{item.input}</p>
                                <p className="text-xs text-zinc-600 mt-2">
                                    {new Date(item.timestamp).toLocaleString()}
                                </p>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Preview Panel */}
                <div className="flex-1 overflow-auto p-6 bg-[#0d1117]">
                    {!selectedItem ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                            <Eye className="h-12 w-12 mb-4 opacity-50" />
                            <p>Select an item to view details</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Input</h3>
                                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                                    {selectedItem.input}
                                </div>
                            </div>

                            {selectedItem.result && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Output</h3>
                                    <pre className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                                        {typeof selectedItem.result === 'string'
                                            ? selectedItem.result
                                            : JSON.stringify(selectedItem.result, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
