"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Phone, Mail, MapPin, MessageSquare, Send, ShieldCheck } from "lucide-react"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) {
      toast.error("Please fill in your name and message")
      return
    }

    setSending(true)
    setTimeout(() => {
      toast.success("Thank you! Your message has been sent to ADIM LAHAH MANDAWA.")
      setName("")
      setPhone("")
      setMessage("")
      setSending(false)
    }, 500)
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 pb-16">
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">Contact Us</h1>
      <p className="text-sm text-slate-500 mb-6">
        Get in touch with ADIM LAHAH MANDAWA (ALM) executive team or send your queries.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Organization Info */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 leading-tight">ADIM LAHAH MANDAWA</h2>
              <p className="text-xs text-slate-500 font-semibold">Regd. No. :- MBJ-3088-27 of 1992-93</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Registered Office Address</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Bahanada, Simagadia, Khunta, Mayurbhanj, Odisha-757104
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Phone & WhatsApp</span>
                <a className="text-emerald-700 font-semibold hover:underline" href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer">
                  +91 99999 99999
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Email Address</span>
                <a className="text-emerald-700 font-semibold hover:underline" href="mailto:info@mandawa.org">
                  info@mandawa.org
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Send Message Form */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <h2 className="font-extrabold text-base text-slate-900 mb-1 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" /> Send a Message
          </h2>
          <p className="text-xs text-slate-500 mb-4">We would love to hear from community members and supporters.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Johar Murmu"
                className="w-full px-4 py-3 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile / Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9800012345"
                className="w-full px-4 py-3 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message *</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your feedback, query, or message here..."
                className="w-full px-4 py-3 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {sending ? "Sending..." : "Submit Message"}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
