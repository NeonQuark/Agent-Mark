"use client"

import { experimental_useObject as useObject } from "@ai-sdk/react"
import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Loader2, Search, Copy, Target, FileText, MessageCircleQuestion, TrendingUp, Hash } from "lucide-react"

// Schema matching the backend
const seoSchema = z.object({
    targetKeyword: z.string(),
    secondaryKeywords: z.array(z.string()),
    searchIntent: z.string(),
    suggestedWordCount: z.number(),
    metaTitle: z.string(),
    metaDescription: z.string(),
    outline: z.array(z.object({
        heading: z.string(),
        type: z.enum(["h1", "h2", "h3"]),
        notes: z.string().optional(),
    })),
    peopleAlsoAsk: z.array(z.string()),
    competitorInsights: z.string(),
});

export default function SEOPage() {
    const [topic, setTopic] = useState("")

    const { object, submit, isLoading } = useObject({
        api: '/api/seo',
        schema: seoSchema,
        onError: (error) => {
            console.error(error);
            alert("Failed to generate SEO brief. Check console.");
        }
    });

    const handleGenerate = () => {
        if (!topic.trim()) return;
        submit({ topic });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-black text-white">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur px-8 py-5 flex items-center justify-between z-10">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Search className="h-6 w-6 text-green-400" />
                        SEO Brief Generator
                    </h1>
                    <p className="text-sm text-zinc-500">Generate ranking content briefs in seconds.</p>
                </div>
                {object?.searchIntent && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-xs font-mono text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20"
                    >
                        <Target className="h-3 w-3" />
                        Intent: {object.searchIntent}
                    </motion.div>
                )}
            </header>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left Panel: Input */}
                <div className="w-full md:w-1/3 flex flex-col border-r border-zinc-800 bg-zinc-950/30 p-6 gap-6">
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-zinc-400">Topic or Keyword</label>
                        <div className="relative">
                            <textarea
                                className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-zinc-200 resize-none focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder:text-zinc-600"
                                placeholder="E.g. Best 3D printers for beginners in 2026..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={handleGenerate}
                            disabled={isLoading || !topic.trim()}
                            className="w-full h-12 bg-green-600 hover:bg-green-500 text-white shadow-lg"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                            {isLoading ? "Researching..." : "Generate SEO Brief"}
                        </Button>
                    </div>

                    {/* Quick Stats */}
                    {object && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3"
                        >
                            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                                    <Target className="h-3 w-3" />
                                    TARGET KEYWORD
                                </div>
                                <div className="text-lg font-semibold text-green-400">{object.targetKeyword}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                                    <FileText className="h-3 w-3" />
                                    RECOMMENDED LENGTH
                                </div>
                                <div className="text-lg font-semibold text-white">{object.suggestedWordCount?.toLocaleString()} words</div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right Panel: Results */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {!object ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                <Search className="h-8 w-8 opacity-50" />
                            </div>
                            <p>Your SEO brief will appear here...</p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            {/* Meta Tags */}
                            <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800">
                                <h3 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
                                    <Hash className="h-4 w-4" /> META TAGS
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <div className="text-xs text-zinc-500 mb-1">Title ({object.metaTitle?.length || 0}/60)</div>
                                        <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg group">
                                            <span className="text-blue-400 font-medium">{object.metaTitle}</span>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => copyToClipboard(object.metaTitle || '')}>
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-500 mb-1">Description ({object.metaDescription?.length || 0}/160)</div>
                                        <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg group">
                                            <span className="text-zinc-300 text-sm">{object.metaDescription}</span>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => copyToClipboard(object.metaDescription || '')}>
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Keywords */}
                            {object.secondaryKeywords && object.secondaryKeywords.length > 0 && (
                                <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800">
                                    <h3 className="text-sm font-semibold text-zinc-400 mb-3">SECONDARY KEYWORDS</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {object.secondaryKeywords.map((kw, i) => (
                                            <span key={i} className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-sm border border-zinc-700">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Content Outline */}
                            {object.outline && object.outline.length > 0 && (
                                <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800">
                                    <h3 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
                                        <FileText className="h-4 w-4" /> CONTENT OUTLINE
                                    </h3>
                                    <div className="space-y-2">
                                        {object.outline.map((item, i) => (
                                            <div
                                                key={i}
                                                className={`p-3 rounded-lg border ${item.type === 'h1' ? 'bg-green-500/10 border-green-500/30 text-green-400 font-bold' :
                                                        item.type === 'h2' ? 'bg-zinc-800/50 border-zinc-700 text-white font-semibold ml-4' :
                                                            'bg-zinc-800/30 border-zinc-800 text-zinc-400 ml-8'
                                                    }`}
                                            >
                                                <span className="text-xs text-zinc-500 mr-2">{item.type?.toUpperCase()}</span>
                                                {item.heading}
                                                {item.notes && <p className="text-xs text-zinc-500 mt-1">{item.notes}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* People Also Ask */}
                            {object.peopleAlsoAsk && object.peopleAlsoAsk.length > 0 && (
                                <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800">
                                    <h3 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
                                        <MessageCircleQuestion className="h-4 w-4" /> PEOPLE ALSO ASK
                                    </h3>
                                    <div className="space-y-2">
                                        {object.peopleAlsoAsk.map((q, i) => (
                                            <div key={i} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 text-zinc-300 text-sm">
                                                {q}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Competitor Insights */}
                            {object.competitorInsights && (
                                <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800">
                                    <h3 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" /> COMPETITOR INSIGHTS
                                    </h3>
                                    <p className="text-zinc-300 text-sm leading-relaxed">{object.competitorInsights}</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
