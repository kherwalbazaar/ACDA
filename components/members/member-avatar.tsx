"use client"

import { useState } from "react"

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((w) => w.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
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
