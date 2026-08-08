 "use client"

import Link from "next/link"

const CATEGORIES = [
  {
    key: "education",
    title: "Education Program",
    summary:
      "ALM Basic Education Programme — Objective: To provide access to quality education for children and youth from underprivileged and tribal communities, ensuring that no child is left behind due to financial or social barriers.",
    points: [
      "Scholarship support for meritorious and needy students",
      "Weekend remedial classes for school-going children",
      "Career guidance and mentorship sessions",
      "Distribution of books, uniforms, and stationery",
    ],
  },
  {
    key: "social",
    title: "Social Activity Program",
    summary:
      "Community welfare drives focused on health, hygiene, environment, and inclusion.",
    points: [
      "Health check-up camps and blood donation drives",
      "Awareness on sanitation, hygiene, and government schemes",
      "Plantation and village cleanliness campaigns",
      "Support for vulnerable families during emergencies",
    ],
  },
  {
    key: "cultural",
    title: "Cultural Program",
    summary:
      "Preserving and promoting tribal culture, language, and traditional art forms.",
    points: [
      "Organization of traditional dance and music events",
      "Workshops on language, folklore, and craft",
      "Festival celebrations with community participation",
      "Documentation of local history and heritage",
    ],
  },
  {
    key: "sports",
    title: "Sport & Youth Development",
    summary:
      "Encouraging youth engagement through sports, leadership, and skill-building.",
    points: [
      "Village/Block-level football and athletics tournaments",
      "Providing basic sports kits and coaching support",
      "Youth leadership and soft-skill workshops",
      "Exposure visits and inter-village competitions",
    ],
  },
] as const

export function Programs() {
  return (
    <section className="mt-4 relative z-[100]">
      <div className="space-y-3">
        {CATEGORIES.map((c, idx) => (
          <details key={c.key} className="group rounded-xl border bg-white shadow-sm overflow-hidden">
            <summary
              className="list-none cursor-pointer select-none flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100"
            >
              <span className="font-semibold text-gray-900">{idx + 1}. {c.title}</span>
              <span className="text-gray-500 group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <div className="px-4 pb-4 pt-2">
              {c.key === "education" ? (
                <div className="text-gray-800">
                  <h4 className="text-lg font-semibold text-gray-900">ALM Basic Education Programme</h4>
                  <p className="mt-1 text-gray-700">
                    Objective: To provide access to quality education for children and youth from underprivileged and tribal communities, ensuring that no child is left behind due to financial or social barriers.
                  </p>

                  <h5 className="mt-4 font-semibold text-gray-900">Key Components</h5>
                  <ul className="mt-2 space-y-3 pl-1">
                    <li>
                      <div className="font-medium">Literacy Support</div>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Evening tuition classes for school-going children.</li>
                        <li>Basic literacy classes for school dropouts and adults.</li>
                      </ul>
                    </li>
                    <li>
                      <div className="font-medium">Scholarship &amp; Aid</div>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Provide notebooks, uniforms, and stationery to needy students.</li>
                        <li>Offer financial aid or scholarships for meritorious and economically weaker students.</li>
                      </ul>
                    </li>
                    <li>
                      <div className="font-medium">Digital Learning</div>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Introduce computer basics and digital awareness workshops.</li>
                        <li>Mobile learning support for students in remote areas.</li>
                      </ul>
                    </li>
                    <li>
                      <div className="font-medium">Skill Development</div>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Conduct vocational training (tailoring, handicrafts, computer skills).</li>
                        <li>Guide youth for competitive exams and career counseling.</li>
                      </ul>
                    </li>
                    <li>
                      <div className="font-medium">Awareness &amp; Motivation</div>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Organize seminars on the importance of education.</li>
                        <li>Invite successful professionals from the community as role models.</li>
                      </ul>
                    </li>
                  </ul>

                  <h5 className="mt-4 font-semibold text-gray-900">Expected Outcomes</h5>
                  <ul className="mt-2 list-disc pl-6 space-y-1">
                    <li>Improved literacy rate in the community.</li>
                    <li>Reduction in school dropouts.</li>
                    <li>Empowered youth with education and skills for better employment opportunities.</li>
                    <li>Stronger community awareness about the value of education.</li>
                  </ul>

                  <div className="mt-4">
                    <Link
                      href="/education"
                      className="inline-block text-sm font-medium text-indigo-700 hover:text-indigo-900 hover:underline"
                    >
                      View full page →
                    </Link>
                  </div>
                </div>
              ) : c.key === "social" ? (
                <div className="text-gray-800">
                  <h4 className="text-lg font-semibold text-gray-900">Social Activity Program</h4>
                  <p className="mt-1 text-gray-700">Community welfare drives focused on health, hygiene, environment, and inclusion.</p>

                  <h5 className="mt-4 font-semibold text-gray-900">Key Activities</h5>
                  <ul className="mt-2 list-disc pl-6 space-y-1">
                    <li>Health check-up camps and blood donation drives.</li>
                    <li>Awareness on sanitation, hygiene, and government schemes.</li>
                    <li>Plantation and village cleanliness campaigns.</li>
                    <li>Support for vulnerable families during emergencies.</li>
                  </ul>

                  <div className="mt-4">
                    <Link href="/social" className="inline-block text-sm font-medium text-indigo-700 hover:text-indigo-900 hover:underline">View full page →</Link>
                  </div>
                </div>
              ) : c.key === "cultural" ? (
                <div className="text-gray-800">
                  <h4 className="text-lg font-semibold text-gray-900">Cultural Program</h4>
                  <p className="mt-1 text-gray-700">Preserving and promoting tribal culture, language, and traditional art forms.</p>

                  <h5 className="mt-4 font-semibold text-gray-900">Key Activities</h5>
                  <ul className="mt-2 list-disc pl-6 space-y-1">
                    <li>Organization of traditional dance and music events.</li>
                    <li>Workshops on language, folklore, and craft.</li>
                    <li>Festival celebrations with community participation.</li>
                    <li>Documentation of local history and heritage.</li>
                  </ul>

                  <div className="mt-4">
                    <Link href="/cultural" className="inline-block text-sm font-medium text-indigo-700 hover:text-indigo-900 hover:underline">View full page →</Link>
                  </div>
                </div>
              ) : c.key === "sports" ? (
                <div className="text-gray-800">
                  <h4 className="text-lg font-semibold text-gray-900">Sport &amp; Youth Development</h4>
                  <p className="mt-1 text-gray-700">Encouraging youth engagement through sports, leadership, and skill-building.</p>

                  <h5 className="mt-4 font-semibold text-gray-900">Key Activities</h5>
                  <ul className="mt-2 list-disc pl-6 space-y-1">
                    <li>Village/Block-level football and athletics tournaments.</li>
                    <li>Providing basic sports kits and coaching support.</li>
                    <li>Youth leadership and soft-skill workshops.</li>
                    <li>Exposure visits and inter-village competitions.</li>
                  </ul>

                  <div className="mt-4">
                    <Link href="/sport" className="inline-block text-sm font-medium text-indigo-700 hover:text-indigo-900 hover:underline">View full page →</Link>
                  </div>
                </div>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

export default Programs
