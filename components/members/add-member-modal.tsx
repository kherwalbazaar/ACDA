"use client"

import { useState } from "react"
import { useMembers } from "@/lib/firebase-data"
import { toast } from "sonner"
import type { Member } from "@/data/members"

export function AddMemberModal({
  open: controlledOpen,
  onOpenChange,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internal, setInternal] = useState(false)
  const open = controlledOpen ?? internal
  const setOpen = (v: boolean) => {
    setInternal(v)
    onOpenChange?.(v)
  }
  const { addMember } = useMembers()
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [designation, setDesignation] = useState("Member")
  const [imageUrl, setImageUrl] = useState("")
  const [saving, setSaving] = useState(false)

  const reset = () => {
    setName("")
    setMobile("")
    setDesignation("Member")
    setImageUrl("")
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Please enter a name")
      return
    }

    const member: Member = {
      id: `mandwa-${Date.now()}`,
      name: name.trim(),
      designation: designation.trim() || "Member",
      phone: mobile.trim(),
      image: imageUrl.trim(),
      membershipFee: 2000,
      paymentHistory: [],
      categories: ["pending"],
    }

    setSaving(true)
    try {
      await addMember(member)
      toast.success(`${member.name} added successfully`)
      setOpen(false)
      reset()
    } catch (err) {
      toast.error("Failed to add member")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {controlledOpen === undefined && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold"
        >
          Add Member
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[9999]">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />

          {/* modal */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <h2 className="font-bold text-lg">Add Member</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-gray-100"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={onSubmit} className="px-5 py-4 space-y-4">
                {/* Profile Image */}
                <div>
                  <label className="block text-sm font-medium mb-1">Profile Image (optional)</label>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden border bg-gray-100 shrink-0">
                      {imageUrl ? (
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-xs text-gray-400">Preview</div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          const reader = new FileReader()
                          reader.onload = () => {
                            setImageUrl(String(reader.result || ""))
                          }
                          reader.readAsDataURL(file)
                        }}
                        className="block w-full text-sm text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                      />
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Or paste image URL"
                        className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Mobile Number</label>
                  <input
                    required
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D+/g, "").slice(0, 10)
                      setMobile(digits)
                    }}
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Digits only, 10 numbers</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Designation</label>
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Member</option>
                    <option>Secretary</option>
                    <option>President</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-md border bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
