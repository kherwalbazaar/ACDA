export const metadata = {
  title: "Member Login",
}

export default function MemberLoginPage() {
  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Member Login</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="member-id">Member ID</label>
          <input id="member-id" className="w-full border rounded px-3 py-2" placeholder="Enter your Member ID" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
          <input id="password" type="password" className="w-full border rounded px-3 py-2" placeholder="Enter your password" />
        </div>
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded">Login</button>
      </form>
    </main>
  )
}
