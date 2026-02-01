"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Loader2, Rocket, Code2, Copy, Twitter, Terminal, Eye, Check } from "lucide-react"
import { HistoryPanel, useHistory } from "@/components/shared/history-panel"
import { TabbedOutput } from "@/components/shared/tabbed-output"

interface CampaignResult {
    landingPageCode: string;
    tweets: string[];
    marketingAngle: string;
}

export default function CampaignPage() {
    const [idea, setIdea] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<CampaignResult | null>(null);
    const [activeTab, setActiveTab] = useState("preview");
    const [historyItems, setHistoryItems] = useState<any[]>([]);
    const [copiedCode, setCopiedCode] = useState(false);

    const { getItems, addItem, deleteItem, clearAll } = useHistory('campaign-history');

    useEffect(() => {
        setHistoryItems(getItems());
    }, []);

    const handleSubmit = async () => {
        if (!idea) return;
        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/generate-campaign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea }),
            });

            if (!response.ok) throw new Error('Failed to generate');

            const text = await response.text();
            const lines = text.trim().split('\n');
            const lastLine = lines[lines.length - 1];

            try {
                const parsed = JSON.parse(lastLine);
                setResult(parsed);
                const updated = addItem(idea, parsed);
                setHistoryItems(updated);
            } catch (e) {
                const jsonMatch = text.match(/\{[\s\S]*"landingPageCode"[\s\S]*"tweets"[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    setResult(parsed);
                    const updated = addItem(idea, parsed);
                    setHistoryItems(updated);
                }
            }
        } catch (error) {
            console.error(error);
            alert('Generation failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleHistorySelect = (item: any) => {
        setIdea(item.input);
        if (item.result) {
            setResult(item.result);
        }
    };

    const handleHistoryDelete = (id: string) => {
        const updated = deleteItem(id);
        setHistoryItems(updated);
    };

    const handleHistoryClear = () => {
        clearAll();
        setHistoryItems([]);
    };

    const handleCopyCode = () => {
        if (result?.landingPageCode) {
            navigator.clipboard.writeText(result.landingPageCode);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    // Generate preview HTML
    const getPreviewHTML = () => {
        if (!result?.landingPageCode) return '';
        const code = result.landingPageCode;
        return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"></script>
<style>body{margin:0;background:#09090b;}</style></head><body><div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const Rocket=()=><span>🚀</span>;const Sparkles=()=><span>✨</span>;const ArrowRight=()=><span>→</span>;
const Check=()=><span>✓</span>;const Star=()=><span>⭐</span>;const Zap=()=><span>⚡</span>;
const Code=()=><span>💻</span>;const Globe=()=><span>🌐</span>;const Mail=()=><span>📧</span>;
const Phone=()=><span>📞</span>;const Coffee=()=><span>☕</span>;const Camera=()=><span>📷</span>;
const Wifi=()=><span>📶</span>;const Shield=()=><span>🛡️</span>;const Clock=()=><span>🕐</span>;
const Package=()=><span>📦</span>;const Target=()=><span>🎯</span>;const Users=()=><span>👥</span>;
const ChevronRight=()=><span>›</span>;const Menu=()=><span>☰</span>;const Heart=()=><span>❤️</span>;
try{${code.replace(/import\s+.*from\s+['"][^'"]+['"];?/g, '').replace(/export\s+default\s+/g, 'const App=')}
const root=ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App||LandingPage||MainComponent));
}catch(e){document.getElementById('root').innerHTML='<div style="color:red;padding:20px">'+e.message+'</div>';}
</script></body></html>`;
    };

    const tabs = [
        {
            id: 'preview',
            label: 'Live Preview',
            icon: <Eye className="h-4 w-4" />,
            content: (
                <iframe
                    srcDoc={getPreviewHTML()}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts"
                    title="Preview"
                />
            )
        },
        {
            id: 'code',
            label: 'Code',
            icon: <Code2 className="h-4 w-4" />,
            content: (
                <div className="p-4 h-full overflow-auto">
                    <div className="flex justify-end mb-2">
                        <Button variant="ghost" size="sm" onClick={handleCopyCode} className={copiedCode ? "text-green-400" : "text-zinc-400"}>
                            {copiedCode ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                            {copiedCode ? "Copied!" : "Copy"}
                        </Button>
                    </div>
                    <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                        {result?.landingPageCode}
                    </pre>
                </div>
            )
        },
        {
            id: 'tweets',
            label: `Tweets (${result?.tweets?.length || 0})`,
            icon: <Twitter className="h-4 w-4" />,
            content: (
                <div className="p-4 space-y-3 overflow-auto h-full">
                    {result?.tweets?.map((tweet, i) => (
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
                                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100"
                                onClick={() => navigator.clipboard.writeText(tweet)}
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                        </motion.div>
                    ))}
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-black text-white">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur px-8 py-5 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Launchpad
                    </h1>
                    <p className="text-sm text-zinc-500">Generate landing page + social content in one click.</p>
                </div>
                {result?.marketingAngle && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden md:flex items-center gap-2 text-xs font-mono text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20"
                    >
                        <Terminal className="h-3 w-3" />
                        {result.marketingAngle}
                    </motion.div>
                )}
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Input + History */}
                <div className="w-80 flex flex-col border-r border-zinc-800 bg-zinc-950/30">
                    {/* Input Section */}
                    <div className="p-4 border-b border-zinc-800">
                        <label className="text-sm font-medium text-zinc-400 mb-2 block">What are we building?</label>
                        <textarea
                            className="w-full h-28 bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-zinc-200 resize-none focus:ring-1 focus:ring-blue-500 outline-none text-sm placeholder:text-zinc-600"
                            placeholder="E.g. A marketplace for used cyberpunk gear..."
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                        />
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading || !idea}
                            className="w-full mt-3 bg-blue-600 hover:bg-blue-500"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Rocket className="h-4 w-4 mr-2" />}
                            {isLoading ? "Generating..." : "Launch"}
                        </Button>
                    </div>

                    {/* History Section */}
                    <div className="flex-1 overflow-auto p-4">
                        <HistoryPanel
                            items={historyItems}
                            onSelect={handleHistorySelect}
                            onDelete={handleHistoryDelete}
                            onClear={handleHistoryClear}
                        />
                    </div>
                </div>

                {/* Right Panel: Tabbed Output */}
                <div className="flex-1 p-4">
                    <TabbedOutput
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        hasContent={!!result}
                        emptyState={
                            <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                                <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                    <Rocket className="h-8 w-8 opacity-50" />
                                </div>
                                <p>Enter an idea and click Launch to get started</p>
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    );
}
