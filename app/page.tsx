"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Code2, Zap } from "lucide-react"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden selection:bg-blue-500/30">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>

            <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-900/50 backdrop-blur-md z-50 sticky top-0">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Agent Mark</h1>
                </div>
                <Link href="/dashboard">
                    <Button variant="outline" className="border-zinc-800 bg-black/50 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-colors">
                        Launch App
                    </Button>
                </Link>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10">
                <div className="max-w-4xl space-y-8 flex flex-col items-center">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-sm text-zinc-400 mb-4"
                    >
                        <Zap className="h-4 w-4 text-yellow-400" />
                        <span>AI-Powered Business Launchpad</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1]"
                    >
                        Build your brand <br />
                        <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                            at the speed of thought.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Describe your business idea. Generate a full landing page code and a viral social media campaign instantly.
                        No coding required. Just pure creation.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 pt-4"
                    >
                        <Link href="/dashboard/campaign">
                            <Button size="lg" className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transition-all hover:scale-105">
                                Start Building <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="https://github.com/NeonQuark/Agent-Mark" target="_blank">
                            <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-zinc-800 bg-black/50 hover:bg-zinc-900 text-white">
                                <Code2 className="mr-2 h-5 w-5" /> View Code
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Tech Demo / Mockup Graphic */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="mt-16 w-full max-w-5xl rounded-xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm p-4 shadow-2xl"
                    >
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50" />
                            <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                            <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50" />
                            <div className="ml-4 h-6 w-64 rounded-md bg-zinc-900/50" />
                        </div>
                        <div className="aspect-[16/9] w-full rounded-lg bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(60,60,60,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-shimmer" />
                            <div className="text-center space-y-4">
                                <Code2 className="h-16 w-16 text-zinc-700 mx-auto group-hover:text-blue-500 transition-colors duration-500" />
                                <div className="space-y-2">
                                    <div className="h-4 w-48 bg-zinc-800 rounded mx-auto" />
                                    <div className="h-4 w-32 bg-zinc-800 rounded mx-auto" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </main>
        </div>
    )
}
