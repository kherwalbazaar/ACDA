"use client"

type QrDonateCardProps = {
  upiId: string
  imageSrc: string
}

export function QrDonateCard({ upiId, imageSrc }: QrDonateCardProps) {
  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiId)
      alert("UPI ID copied to clipboard")
    } catch (e) {
      alert("Could not copy. Please copy manually: " + upiId)
    }
  }

  const downloadQR = () => {
    const link = document.createElement("a")
    link.href = imageSrc
    link.download = "ALM-donation-qr.png"
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const shareQR = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Donate to ADIM LAHAH MANDAWA",
          text: `UPI: ${upiId}`,
          url: window.location.href,
        })
      } else {
        alert("Sharing not supported. Please copy UPI or download QR.")
      }
    } catch (_) {
      // ignore cancel
    }
  }

  return (
    <section className="rounded-2xl border bg-white shadow-xl p-6 flex flex-col items-center justify-center">
      <h2 className="text-xl font-extrabold mb-2 text-gray-800">Scan & Pay</h2>
      <p className="text-sm text-gray-600 mb-4">Use any UPI app (PhonePe / GPay / Paytm)</p>
      <div className="bg-gradient-to-br from-green-600 to-blue-600 p-3 rounded-2xl shadow-inner">
        <div className="bg-white rounded-xl p-3">
          <img src={imageSrc} alt="Donation QR" className="w-60 h-60 object-contain" />
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className="text-xs text-gray-500">UPI ID</div>
        <div className="text-lg font-bold tracking-wide">{upiId}</div>
      </div>
      <div className="mt-4 flex gap-3 flex-wrap justify-center">
        <button onClick={copyUpi} className="px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold">Copy UPI</button>
        <button onClick={downloadQR} className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold">Download QR</button>
        <button onClick={shareQR} className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold">Share</button>
      </div>
    </section>
  )
}
