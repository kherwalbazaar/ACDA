"use client"

import React, { useState, useEffect } from "react"
import { MessageCircle, Send, ShieldCheck, CheckCheck, ArrowLeft, Plus, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCommunityChat } from "@/lib/firebase-data"

export default function ChatPage() {
  const router = useRouter()
  const [inputFocused, setInputFocused] = useState(false)
  const { messages, send } = useCommunityChat()

  const [uid, setUid] = useState<string>("")
  const [myName, setMyName] = useState<string | null>(null)
  const [nameInput, setNameInput] = useState("")

  useEffect(() => {
    let id = localStorage.getItem("chat_uid")
    if (!id) {
      id = "u-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
      localStorage.setItem("chat_uid", id)
    }
    setUid(id)
    setMyName(localStorage.getItem("chat_name"))
  }, [])

  const saveName = (e: React.FormEvent) => {
    e.preventDefault()
    const name = nameInput.trim()
    if (!name) return
    localStorage.setItem("chat_name", name)
    setMyName(name)
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMsg.trim()) return

    send({
      sender: myName || "Member",
      senderId: uid,
      avatar: "",
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      fromMe: false,
    })
    setInputMsg("")
  }

  const isMine = (msg: { senderId?: string; fromMe?: boolean }) =>
    msg.senderId ? msg.senderId === uid : !!msg.fromMe

  const [inputMsg, setInputMsg] = useState("")

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {!myName && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-6">
          <form
            onSubmit={saveName}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
          >
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <User className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Welcome to the Chat</h2>
              <p className="text-xs text-slate-500 mt-1">Enter your name to start messaging.</p>
              <input
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Your name"
                className="mt-4 w-full bg-slate-100 text-slate-900 placeholder-slate-400 px-4 py-3 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-slate-200"
              />
            </div>
            <div className="p-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={!nameInput.trim()}
                className="w-full py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition shadow-sm disabled:opacity-50"
              >
                Start Chat
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-slate-900 text-white px-4 pt-4 pb-3 shadow-md border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700 active:scale-95 transition-all"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm text-white">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight flex items-center gap-1.5">
                ALM Chat
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h1>
              <p className="text-[11px] text-slate-400">Community Messaging</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Timeline */}
      <div className="p-4 space-y-3 pb-28">
        <div className="text-center my-2">
          <span className="text-[10px] bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-medium shadow-2xs">
            Today Channel Messages
          </span>
        </div>

        {messages.map((msg) => {
          const mine = isMine(msg)
          return (
          <div
            key={msg.id}
            className={`flex gap-2.5 max-w-[85%] ${mine ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            {!mine && (
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 bg-white">
                <img
                  src={msg.avatar}
                  alt={msg.sender}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as any).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender)}&background=0D9488&color=fff`
                  }}
                />
              </div>
            )}

            <div
              className={`p-3 rounded-2xl text-xs shadow-2xs relative ${
                mine
                  ? "bg-emerald-700 text-white rounded-tr-none"
                  : "bg-white text-slate-900 border border-slate-200/80 rounded-tl-none"
              }`}
            >
              {!mine && (
                <div className="font-extrabold text-[11px] text-emerald-700 mb-0.5">{msg.sender}</div>
              )}
              <p className="leading-relaxed">{msg.text}</p>
              <div
                className={`text-[9px] mt-1 text-right flex items-center justify-end gap-1 ${
                  mine ? "text-emerald-200" : "text-slate-400"
                }`}
              >
                <span>{msg.time}</span>
                {mine && <CheckCheck className="w-3 h-3 text-emerald-300" />}
              </div>
            </div>
          </div>
          )
        })}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSend}
        className={`fixed left-0 right-0 max-w-md mx-auto px-3 py-2.5 bg-white border-t border-slate-200 shadow-md flex items-center gap-2 z-40 bottom-0`}
      >
        <button
          type="button"
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 active:scale-95 transition-all flex-shrink-0"
          aria-label="Attach"
        >
          <Plus className="w-5 h-5" />
        </button>
        <input
          type="text"
          placeholder="Type message to community..."
          value={inputMsg}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          onChange={(e) => setInputMsg(e.target.value)}
          className="flex-1 bg-slate-100 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-slate-200"
        />
        <button
          type="submit"
          className={`w-10 h-10 rounded-full text-white flex items-center justify-center active:scale-95 transition-all shadow-md flex-shrink-0 ${
            inputMsg.trim() ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-300"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}