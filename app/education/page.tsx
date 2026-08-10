export const metadata = {
  title: "Education Program",
}

export default function EducationPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">ALM Basic Education Programme</h1>

      <section className="space-y-4 text-gray-800">
        <p className="text-gray-700">
          <span className="font-semibold">Objective:</span> To provide access to quality education for children and youth from underprivileged and tribal communities, ensuring that no child is left behind due to financial or social barriers.
        </p>

        <div>
          <h2 className="text-xl font-semibold text-gray-900">Key Components</h2>
          <ul className="mt-2 space-y-4 pl-1">
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
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900">Expected Outcomes</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Improved literacy rate in the community.</li>
            <li>Reduction in school dropouts.</li>
            <li>Empowered youth with education and skills for better employment opportunities.</li>
            <li>Stronger community awareness about the value of education.</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
