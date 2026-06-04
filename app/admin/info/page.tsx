import Link from "next/link";

export default function AdminInfoPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/95 backdrop-blur-md px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="text-2xl font-semibold">
            Aavi Chess Tutor
          </Link>
          <Link href="/" className="text-slate-300 hover:text-white transition">Home</Link>
        </div>
      </nav>

      <section className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="text-4xl font-semibold">Admin Dashboard Access</h1>

        <div className="mt-8 space-y-6">
          <div className="rounded-3xl border border-blue-400/20 bg-blue-400/10 p-6">
            <h2 className="text-2xl font-semibold text-blue-100">How to Access Admin Dashboard</h2>
            <p className="mt-4 text-slate-300">
              You can manage your availability and bookings at the admin dashboard.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Step 1: Go to Admin Page</h3>
            <p className="mt-3 text-slate-300">
              Visit this URL in your browser:
            </p>
            <code className="mt-3 block rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-yellow-100 break-all">
              https://aavichesstutor.vercel.app/admin
            </code>
            <p className="mt-3 text-slate-400 text-sm">
              Or click the button below:
            </p>
            <Link href="/admin" className="mt-3 inline-flex rounded-full bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400">
              Go to Admin Dashboard
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Step 2: Login</h3>
            <p className="mt-3 text-slate-300">
              Enter your admin password to login.
            </p>
            <p className="mt-3 text-slate-400 text-sm">
              <strong>Password:</strong> aavi123
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">Step 3: Manage Availability</h3>
            <p className="mt-3 text-slate-300">
              Once logged in, you can:
            </p>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li>✓ <strong>Add Available Slots</strong> - Choose a date and select which times are available for booking</li>
              <li>✓ <strong>Edit Booked Status</strong> - Toggle individual time slots between AVAILABLE and BOOKED</li>
              <li>✓ <strong>Block Dates</strong> - Remove entire dates from availability (e.g., vacations)</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-green-400/20 bg-green-400/10 p-6">
            <h3 className="text-xl font-semibold text-green-100">Example Workflow</h3>
            <p className="mt-3 text-slate-300">
              1. Go to Admin Dashboard → <br/>
              2. Login with password → <br/>
              3. Select June 15, 2026 → <br/>
              4. Click "9:00 AM", "10:00 AM", "3:00 PM" to add them as available → <br/>
              5. Click "Add Available" → <br/>
              6. Now customers can book these slots! → <br/>
              7. When someone books "10:00 AM", it automatically shows as BOOKED → <br/>
              8. You can manually toggle any slot from "Edit Booked Status" if needed
            </p>
          </div>
        </div>

        <Link href="/" className="mt-12 inline-flex rounded-full border border-white/15 bg-white/5 px-6 py-3 transition hover:bg-white/10">
          Back to Home
        </Link>
      </section>
    </main>
  );
}
