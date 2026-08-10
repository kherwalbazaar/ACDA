export const metadata = {
  title: "Social Activity Program",
}

export default function SocialPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Social Activity Program</h1>

      <section className="space-y-4 text-gray-800">
        <p className="text-gray-700">
          Community welfare drives focused on health, hygiene, environment, and inclusion.
        </p>

        <div>
          <h2 className="text-xl font-semibold text-gray-900">Key Activities</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Health check-up camps and blood donation drives.</li>
            <li>Awareness on sanitation, hygiene, and government schemes.</li>
            <li>Plantation and village cleanliness campaigns.</li>
            <li>Support for vulnerable families during emergencies.</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
