"use client"

import { useCompletion } from "@ai-sdk/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Code, ArrowRight, Loader2, Copy, Sparkles } from "lucide-react"

export default function DesignPage() {
    const { completion, complete, isLoading } = useCompletion({
        api: '/api/design',
    })

    const [prompt, setPrompt] = useState("")
    const result = completion

    const handleGenerate = async () => {
        if (!prompt) return
        await complete(prompt)
    }

    return (
        <>
            <header className="sticky top-0 z-30 border-b border-zinc-800 bg-black/95 px-8 py-5 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-purple-500" />
                        AI Web Designer
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">Describe a component and get the Code.</p>
                </div>
                <div className="flex gap-2">
                    {/* Placeholder for future controls */}
                </div>
            </header>

            <div className="p-8 grid lg:grid-cols-2 gap-8 h-[calc(100vh-100px)]">
                {/* Input Section */}
                <div className="flex flex-col gap-4">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex-1 flex flex-col">
                        <label className="text-sm font-medium text-zinc-400 mb-2">Describe your UI Component</label>
                        <textarea
                            className="flex-1 bg-transparent border-none resize-none focus:ring-0 text-zinc-200 outline-none p-2 font-mono text-sm"
                            placeholder="e.g. A modern pricing table with 3 cards, glassmorphism effect, and a toggle for monthly/yearly..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt}
                        className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-500 text-white"
                    >
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Code className="mr-2" />}
                        {isLoading ? "Designing..." : "Generate Code"}
                    </Button>
                </div>

                {/* Output Section */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-0 relative overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center p-3 border-b border-zinc-800 bg-zinc-900/50">
                        <span className="text-xs font-mono text-zinc-400">React + Tailwind</span>
                        <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(result)} className="h-8 text-xs">
                            <Copy className="h-3 w-3 mr-2" /> Copy Code
                        </Button>
                    </div>

                    <div className="flex-1 overflow-auto p-4 bg-[#0d1117]">
                        {!result ? (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-50">
                                <Code className="h-12 w-12 mb-4" />
                                <p>Code will appear here</p>
                            </div>
                        ) : (
                            <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap">
                                <code>{result}</code>
                            </pre>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
