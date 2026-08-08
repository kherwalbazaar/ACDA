"use client"

import { MemberDetails } from "@/components/members/member-details"
import { useParams } from "next/navigation"

export default function MemberDetailsPage() {
  const params = useParams<{ id: string }>()
  return <MemberDetails memberId={params.id} />
}