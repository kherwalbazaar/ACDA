export const metadata = {
  title: "Members",
}

import { MembersList } from "@/components/members/members-list"
import { AddMemberModal } from "@/components/members/add-member-modal"

export default function MembersPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-bold">Members</h1>
        <AddMemberModal />
      </div>
      <MembersList />
    </main>
  )
}
