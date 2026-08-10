export const metadata = {
  title: "Events / Programs",
}

import Programs from "@/components/events/programs"

export default function EventsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Events / Programs</h1>
      <Programs />
      <p className="text-gray-600 mt-6">Add and manage community events and programs here.</p>
    </main>
  )
}
