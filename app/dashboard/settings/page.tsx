"use client"

import { useState, useEffect } from "react"
import { Settings, Key, Palette, Bell, Shield, Save, Check, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function SettingsPage() {
    const [apiKey, setApiKey] = useState("")
    const [showApiKey, setShowApiKey] = useState(false)
    const [theme, setTheme] = useState("dark")
    const [notifications, setNotifications] = useState(true)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('app-settings')
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings)
                setTheme(parsed.theme || 'dark')
                setNotifications(parsed.notifications ?? true)
            } catch (e) { }
        }
    }, [])

    const handleSave = () => {
        localStorage.setItem('app-settings', JSON.stringify({
            theme,
            notifications,
        }))
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-black text-white">
            <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur px-8 py-5">
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Settings className="h-6 w-6 text-zinc-400" />
                    Settings
                </h1>
                <p className="text-sm text-zinc-500">Configure your preferences.</p>
            </header>

            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-2xl space-y-8">
                    {/* API Key Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Key className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">API Configuration</h3>
                                <p className="text-sm text-zinc-500">Managed via environment variables</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-zinc-400 mb-2 block">Google AI API Key</label>
                                <div className="relative">
                                    <input
                                        type={showApiKey ? "text" : "password"}
                                        value="••••••••••••••••••••"
                                        disabled
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-zinc-400 pr-12"
                                    />
                                    <button
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                                    >
                                        {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <p className="text-xs text-zinc-600 mt-2">
                                    API key is configured in .env.local file
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Appearance Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <Palette className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Appearance</h3>
                                <p className="text-sm text-zinc-500">Customize the look and feel</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-zinc-400 mb-3 block">Theme</label>
                                <div className="flex gap-3">
                                    {['dark', 'light', 'system'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTheme(t)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${theme === t
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Notifications Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <Bell className="h-5 w-5 text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Notifications</h3>
                                <p className="text-sm text-zinc-500">Manage your notification preferences</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-300">Enable browser notifications</span>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-blue-600' : 'bg-zinc-700'
                                    }`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications ? 'left-7' : 'left-1'
                                    }`} />
                            </button>
                        </div>
                    </motion.div>

                    {/* Save Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Button
                            onClick={handleSave}
                            className={`w-full h-12 text-base ${saved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-500'
                                }`}
                        >
                            {saved ? (
                                <>
                                    <Check className="h-5 w-5 mr-2" />
                                    Saved!
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5 mr-2" />
                                    Save Settings
                                </>
                            )}
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
