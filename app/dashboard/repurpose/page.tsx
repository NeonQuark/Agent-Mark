"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { FileText, ArrowRight, Loader2, Copy, Check } from "lucide-react"

export default function RepurposePage() {
    const [content, setContent] = useState("")
    const [result, setResult] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [copied, setCopied] = useState(false)

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

            if (!response.ok) {
                throw new Error('Failed to generate thread')
            }

            const text = await response.text()
            setResult(text)
        } catch (error) {
            console.error(error)
            alert('Generation failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(result)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
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
                        <label className="text-sm font-medium text-zinc-400 mb-2">Paste your content</label>
                        <textarea
                            className="flex-1 bg-transparent border-none resize-none focus:ring-0 text-zinc-200 outline-none p-2"
                            placeholder="Paste your article text here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={handleRepurpose}
                        disabled={isLoading || !content}
                        className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-500"
                    >
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <ArrowRight className="mr-2" />}
                        {isLoading ? "Generating..." : "Generate Thread"}
                    </Button>
                </div>

                {/* Output Section */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden flex flex-col">
                    {!result ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                            <FileText className="h-12 w-12 mb-4 opacity-50" />
                            <p>Generated thread will appear here</p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                                <span className="text-sm font-mono text-blue-400">Twitter Thread</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopy}
                                    className={copied ? "text-green-400" : ""}
                                >
                                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                    {copied ? "Copied!" : "Copy"}
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
