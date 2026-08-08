"use client"

import { FloatingBottomNav } from "@/components/android/floating-bottom-nav"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center selection:bg-emerald-500 selection:text-white font-sans">
      {/* Mobile App Container Frame */}
      <div className="w-full max-w-md min-h-screen bg-slate-50 text-slate-900 flex flex-col relative shadow-2xl border-x border-slate-800/20">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>

        {/* Floating Pill Bottom Navigation Bar */}
        <FloatingBottomNav />
      </div>
    </div>
  )
}