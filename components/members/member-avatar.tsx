"use client"

import { useState } from "react"

function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return "?"
  if (words.length === 1) return words[0][0].toUpperCase()
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
}

export function MemberAvatar({
  name,
  image,
  className = "h-12 w-12",
  textClassName = "text-sm",
}: {
  name: string
  image: string
  className?: string
  textClassName?: string
}) {
  const [failed, setFailed] = useState(false)

  if (failed || !image) {
    return (
      <div
        className={`${className} ${textClassName} rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center shrink-0`}
      >
        {initialsOf(name)}
      </div>
    )
  }

  return (
    <img
      src={image}
      alt={name}
      className={`${className} rounded-full object-cover shrink-0`}
      onError={() => setFailed(true)}
    />
  )
}
