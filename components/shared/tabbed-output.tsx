"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"

interface Tab {
    id: string
    label: string
    icon?: ReactNode
    content: ReactNode
}

interface TabbedOutputProps {
    tabs: Tab[]
    activeTab: string
    onTabChange: (tabId: string) => void
    emptyState?: ReactNode
    hasContent: boolean
}

export function TabbedOutput({ tabs, activeTab, onTabChange, emptyState, hasContent }: TabbedOutputProps) {
    const currentTab = tabs.find(t => t.id === activeTab) || tabs[0]

    return (
        <div className="flex flex-col h-full bg-[#0d1117] rounded-xl border border-zinc-800 overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-zinc-800 bg-zinc-950/80">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id
                                ? 'text-blue-400 border-blue-400 bg-blue-500/5'
                                : 'text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-800/50'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto">
                {!hasContent ? (
                    emptyState || (
                        <div className="h-full flex items-center justify-center text-zinc-600">
                            <p>Generated content will appear here...</p>
                        </div>
                    )
                ) : (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        {currentTab.content}
                    </motion.div>
                )}
            </div>
        </div>
    )
}
