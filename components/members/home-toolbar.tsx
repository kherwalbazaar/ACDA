"use client"

import { useEffect, useRef, useState } from "react"
import { Search, SlidersHorizontal, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export const CATEGORIES = ["All", "Paid", "Pending", "VIP", "Executive", "New", "Birthday"] as const
export type Category = (typeof CATEGORIES)[number]

export function HomeToolbar({
  category,
  setCategory,
  query,
  setQuery,
  inputRef,
  onFocus,
}: {
  category: Category
  setCategory: (c: Category) => void
  query: string
  setQuery: (q: string) => void
  inputRef?: React.LegacyRef<HTMLInputElement>
  onFocus?: () => void
}) {
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div className="bg-white border-b border-slate-200">
      {/* Category pills */}
      <nav className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition",
              category === c
                ? "bg-whatsapp text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
            )}
          >
            {c}
          </button>
        ))}
      </nav>

      {/* Search bar */}
      <div className="px-4 pb-3">
        <div className="flex items-center bg-slate-100 rounded-full border border-slate-200 px-4 py-2 focus-within:ring-2 focus-within:ring-whatsapp transition">
          <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={onFocus}
            placeholder="Search by Name, Mobile, or Member ID..."
            className="w-full bg-transparent text-sm outline-none placeholder-slate-400 text-slate-700"
          />
          <div className="relative" ref={filterRef}>
            <button
              className={cn("p-1 transition rounded-full", filterOpen ? "text-whatsapp" : "text-whatsapp hover:text-whatsapp-dark")}
              aria-label="Filter"
              onClick={() => setFilterOpen((v) => !v)}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 py-1 w-40 z-50">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCategory(c)
                      setFilterOpen(false)
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {c}
                    {category === c && <Check className="h-4 w-4 text-whatsapp" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}