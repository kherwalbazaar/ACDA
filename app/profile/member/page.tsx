"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { MemberDetails } from "@/components/members/member-details"

export default function MemberPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const memberId = searchParams.get("id") || ""

  // If no ID in query, redirect to home or show empty state
  if (!memberId) {
    router.push("/")
    return null
  }

  // MemberDetails uses memberId as a prop; we pass it via context or
  // re-fetch via useMemberById if needed. For now, render with the ID.
  return <MemberDetails memberId={memberId} />
}