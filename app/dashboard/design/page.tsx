"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Code2, Loader2, Copy, Check, Paintbrush } from "lucide-react"

export default function DesignPage() {
    const [prompt, setPrompt] = useState("")
    const [result, setResult] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [copied, setCopied] = useState(false)

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

            if (!response.ok) {
                throw new Error('Failed to generate design')
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

    // Extract code from markdown if present
    const extractCode = (text: string) => {
        const codeMatch = text.match(/```(?:jsx|tsx|javascript|react)?\n?([\s\S]*?)```/)
        return codeMatch ? codeMatch[1].trim() : text
    }

    return (
        <>
            <header className="sticky top-0 z-30 border-b border-zinc-800 bg-black/95 px-8 py-5">
                <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
                    <Paintbrush className="h-6 w-6 text-purple-400" />
                    Web Designer
                </h1>
                <p className="mt-1 text-sm text-zinc-500">Generate React + Tailwind components from descriptions.</p>
            </header>

            <div className="p-8 grid lg:grid-cols-2 gap-8 h-[calc(100vh-100px)]">
                {/* Input Section */}
                <div className="flex flex-col gap-4">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex-1 flex flex-col">
                        <label className="text-sm font-medium text-zinc-400 mb-2">Describe your component</label>
                        <textarea
                            className="flex-1 bg-transparent border-none resize-none focus:ring-0 text-zinc-200 outline-none p-2"
                            placeholder="E.g. A modern hero section with gradient background, centered headline, subtext, and a CTA button..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt}
                        className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-500"
                    >
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Code2 className="mr-2" />}
                        {isLoading ? "Generating..." : "Generate Component"}
                    </Button>
                </div>

                {/* Output Section */}
                <div className="bg-[#0d1117] border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-950/80">
                        <span className="text-sm font-mono text-purple-400 flex items-center gap-2">
                            <Code2 className="h-4 w-4" />
                            Component.tsx
                        </span>
                        {result && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopy}
                                className={copied ? "text-green-400" : "text-zinc-400"}
                            >
                                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                {copied ? "Copied!" : "Copy"}
                            </Button>
                        )}
                    </div>

                    <div className="flex-1 overflow-auto p-4">
                        {!result ? (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                                <Code2 className="h-12 w-12 mb-4 opacity-50" />
                                <p>Generated code will appear here</p>
                            </div>
                        ) : (
                            <motion.pre
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed"
                            >
                                {extractCode(result)}
                            </motion.pre>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
