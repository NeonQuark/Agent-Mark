"use client"

import { Clock, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface HistoryItem {
    id: string
    input: string
    timestamp: number
    result?: any
}

interface HistoryPanelProps {
    items: HistoryItem[]
    onSelect: (item: HistoryItem) => void
    onDelete: (id: string) => void
    onClear: () => void
}

export function HistoryPanel({ items, onSelect, onDelete, onClear }: HistoryPanelProps) {
    if (items.length === 0) {
        return (
            <div className="text-center py-8 text-zinc-600 text-sm">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No history yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">History</span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className="text-xs text-zinc-500 hover:text-red-400 h-6 px-2"
                >
                    Clear All
                </Button>
            </div>

            {items.slice(0, 10).map((item, i) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => onSelect(item)}
                    className="group p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all relative"
                >
                    <p className="text-sm text-zinc-300 line-clamp-2 pr-6">
                        {item.input}
                    </p>
                    <p className="text-xs text-zinc-600 mt-1">
                        {new Date(item.timestamp).toLocaleTimeString()}
                    </p>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete(item.id)
                        }}
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400"
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </motion.div>
            ))}
        </div>
    )
}

// Hook for managing history in localStorage
export function useHistory(key: string) {
    const getItems = (): HistoryItem[] => {
        if (typeof window === 'undefined') return []
        const stored = localStorage.getItem(key)
        return stored ? JSON.parse(stored) : []
    }

    const addItem = (input: string, result?: any) => {
        const items = getItems()
        const newItem: HistoryItem = {
            id: Date.now().toString(),
            input,
            timestamp: Date.now(),
            result,
        }
        const updated = [newItem, ...items].slice(0, 20) // Keep last 20
        localStorage.setItem(key, JSON.stringify(updated))
        return updated
    }

    const deleteItem = (id: string) => {
        const items = getItems().filter(item => item.id !== id)
        localStorage.setItem(key, JSON.stringify(items))
        return items
    }

    const clearAll = () => {
        localStorage.removeItem(key)
        return []
    }

    return { getItems, addItem, deleteItem, clearAll }
}
