export const metadata = {
  title: "User Login",
}

export default function UserLoginPage() {
  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">User Login</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <input id="email" type="email" className="w-full border rounded px-3 py-2" placeholder="Enter your email" />
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
