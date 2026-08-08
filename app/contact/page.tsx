export const metadata = {
  title: "Contact Us | ADIM LAKCHAR CHIRGAL GAONTA",
}

export default function ContactPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <section className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">Contact Details</h2>
          <ul className="space-y-1 text-gray-700">
            <li>
              Phone: <a className="text-teal-700 hover:underline" href="tel:+919999999999">+91 99999 99999</a>
            </li>
            <li>
              WhatsApp: <a className="text-teal-700 hover:underline" href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer">+91 99999 99999</a>
            </li>
            <li>Address: Your community address here</li>
            <li>
              Email: <a className="text-teal-700 hover:underline" href="mailto:info@mandawa.org">info@mandawa.org</a>
            </li>
          </ul>
        </section>
        <section className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">Send a Message</h2>
          <p className="text-gray-600">Add a form here later if you want to receive messages.</p>
        </section>
      </div>
    </main>
  )
}
