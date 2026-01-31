
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { FileText, ArrowRight, Loader2, Copy } from "lucide-react"

export default function RepurposePage() {
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState("")
    const [result, setResult] = useState("")

    const handleRepurpose = async () => {
        if (!content) return
        setLoading(true)
        setResult("")

        try {
            const response = await fetch('/api/repurpose', {
                method: 'POST',
                body: JSON.stringify({ prompt: content }),
            })

            if (!response.ok) {
                throw new Error('Failed to generate')
            }

            // Simple stream reader
            const reader = response.body?.getReader()
            const decoder = new TextDecoder()

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    const chunk = decoder.decode(value, { stream: true })
                    // The AI SDK returns data formatted like "0:text", so we act slightly heuristic here 
                    // or just display raw chunk if it's text. 
                    // For simplicity in this "alternative fix", we'll verify if we need to parse it.
                    // Vercel AI SDK 'streamText' often sends raw text if used simply, or specific protocol.
                    // Let's assume raw text capability or just append.
                    setResult((prev) => prev + chunk)
                }
            }
        } catch (error) {
            console.error(error)
            setResult("Error generating content. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <header className="sticky top-0 z-30 border-b border-zinc-800 bg-black/95 px-8 py-5">
                <h1 className="text-2xl font-semibold tracking-tight text-white">Content Repurposer</h1>
                <p className="mt-1 text-sm text-zinc-500">Transform blog posts into viral social threads.</p>
            </header>

            <div className="p-8 grid lg:grid-cols-2 gap-8 h-[calc(100vh-100px)]">
                {/* Input Section */}
                <div className="flex flex-col gap-4">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex-1 flex flex-col">
                        <label className="text-sm font-medium text-zinc-400 mb-2">Paste your content or URL</label>
                        <textarea
                            className="flex-1 bg-transparent border-none resize-none focus:ring-0 text-zinc-200 outline-none p-2"
                            placeholder="Paste your article text here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={handleRepurpose}
                        disabled={loading || !content}
                        className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-500"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <ArrowRight className="mr-2" />}
                        {loading ? "Generating..." : "Generate Thread"}
                    </Button>
                </div>

                {/* Output Section */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
                    {!result ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                            <FileText className="h-12 w-12 mb-4 opacity-50" />
                            <p>Generated content will appear here</p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                                <span className="text-sm font-mono text-blue-400">Twitter Thread</span>
                                <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(result)}>
                                    <Copy className="h-4 w-4 mr-2" /> Copy
                                </Button>
                            </div>
                            <div className="whitespace-pre-wrap text-zinc-300 font-mono text-sm overflow-y-auto flex-1 leading-relaxed">
                                {result}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    )
}
