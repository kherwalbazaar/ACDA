import { members } from "@/data/members"
import { MemberDetails } from "@/components/members/member-details"

export function generateStaticParams() {
  const ids = new Set([...members.map((member) => member.id), "mandwa-1787372117946"])
  return [...ids].map((id) => ({ id }))
}

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <MemberDetails memberId={id} />
}