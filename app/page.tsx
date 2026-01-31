
import { Button } from "@/components/ui/button"
import { Countdown } from "@/components/landing/countdown"
import { WaitlistForm } from "@/components/landing/waitlist-form"
import Link from "next/link"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                <h1 className="text-xl font-bold">Follow Agent</h1>
                <Link href="/dashboard">
                    <Button variant="outline">Login</Button>
                </Link>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="max-w-2xl space-y-6">
                    <h2 className="text-5xl font-extrabold tracking-tight sm:text-7xl bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        Turn ideas into campaigns.
                    </h2>
                    <p className="text-xl text-zinc-400">
                        Repurpose content, analyze performance, and ship without waiting.
                        The all-in-one agent for creators and teams.
                    </p>

                    <div className="pt-8 flex flex-col items-center gap-8 w-full">


                        <div className="w-full max-w-md p-1 rounded-2xl bg-gradient-to-br from-zinc-800 to-black">
                            <div className="p-8 bg-black rounded-2xl border border-zinc-800/50 backdrop-blur-xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-blue-500/5 blur-[100px]" />
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold mb-2">Join the Waitlist</h3>
                                    <p className="text-zinc-400 mb-6">Get early access to the future of campaign management.</p>
                                    <WaitlistForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
