"use client"

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Users, Shield, User, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function LoginDropdown() {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          onClick={() => setOpen(!open)}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          Login <ChevronDown size={16} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={6}
        className="z-[9999] min-w-[200px] bg-white shadow-lg rounded-md"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <DropdownMenuItem asChild>
          <Link href="/login/member" className="flex items-center gap-2">
            <Users size={16} /> Member Login
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/login/admin" className="flex items-center gap-2">
            <Shield size={16} /> Admin Login
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/login/user" className="flex items-center gap-2">
            <User size={16} /> User Login
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
