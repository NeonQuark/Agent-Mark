"use client"

import { experimental_useObject as useObject } from "@ai-sdk/react"
import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Loader2, Rocket, Code2, Copy, Twitter, Terminal } from "lucide-react"

// Schema definition matching backend
const campaignSchema = z.object({
    landingPageCode: z.string(),
    tweets: z.array(z.string()),
    marketingAngle: z.string(),
});

export default function CampaignPage() {
    const [idea, setIdea] = useState("");

    const { object, submit, isLoading } = useObject({
        api: '/api/generate-campaign',
        schema: campaignSchema,
        onError: (error) => {
            console.error(error);
            alert("Failed to generate campaign. Check console/logs.");
        }
    });

    const handleSubmit = async () => {
        if (!idea) return;
        submit({ idea });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-black text-white selection:bg-blue-500/30">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur px-8 py-5 flex items-center justify-between z-10">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Launchpad
                    </h1>
                    <p className="text-sm text-zinc-500">Generate code & content from a single prompt.</p>
                </div>
                {object?.marketingAngle && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden md:flex items-center gap-2 text-xs font-mono text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20"
                    >
                        <Terminal className="h-3 w-3" />
                        Strategy: {object.marketingAngle}
                    </motion.div>
                )}
            </header>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                {/* Left Panel: Input & Tweets */}
                <div className="w-full md:w-1/3 flex flex-col border-r border-zinc-800 bg-zinc-950/30 p-6 gap-6 overflow-y-auto z-10">

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-zinc-400">What are we building?</label>
                        <div className="relative">
                            <textarea
                                className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-zinc-200 resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-600"
                                placeholder="E.g. A marketplace for used cyberpunk gear..."
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                            />
                            <div className="absolute bottom-3 right-3">
                                <Button
                                    size="sm"
                                    onClick={handleSubmit}
                                    disabled={isLoading || !idea}
                                    className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Tweets Section */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
                            <Twitter className="h-4 w-4 text-blue-400" />
                            <span>Social Campaign</span>
                        </div>

                        <div className="space-y-3">
                            {object?.tweets?.map((tweet, i) => (
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
                            {!object?.tweets && (
                                <div className="text-center py-10 text-zinc-600 text-sm italic">
                                    Tweets will appear here...
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Code Output */}
                <div className="flex-1 flex flex-col bg-[#0d1117] relative overflow-hidden">

                    {/* Grid Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                    <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur z-20">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Code2 className="h-4 w-4" />
                            <span className="font-mono">LandingPage.tsx</span>
                        </div>
                        {object?.landingPageCode && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-zinc-400 hover:text-white"
                                onClick={() => navigator.clipboard.writeText(object.landingPageCode)}
                            >
                                <Copy className="h-4 w-4 mr-2" /> Copy Code
                            </Button>
                        )}
                    </div>

                    <div className="flex-1 overflow-auto p-6 z-10 custom-scrollbar">
                        {object?.landingPageCode ? (
                            <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                {object.landingPageCode}
                            </pre>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                                <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center animate-pulse">
                                    <Code2 className="h-8 w-8 opacity-50" />
                                </div>
                                <p>Generated code will render here...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
