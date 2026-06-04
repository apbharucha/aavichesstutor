import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/95 backdrop-blur-md px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="text-2xl font-semibold">
            Aavi Chess Tutor
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-slate-300 hover:text-white transition">Home</Link>
            <Link href="/lessons" className="text-slate-300 hover:text-white transition">Lessons</Link>
            <Link href="/faq" className="text-slate-300 hover:text-white transition">FAQ</Link>
            <a href="/#booking" className="text-slate-300 hover:text-white transition">Book</a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          {/* Photo - Fixed container to show full image */}
          <div className="h-fit">
            <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-4">
              <img
                src="/aavi-nationals.jpg"
                alt="Aavi at K-8 Nationals in Atlanta"
                className="block h-auto w-full rounded-2xl object-contain"
              />
            </div>
            <p className="mt-4 text-center text-sm text-slate-400">
              At K-8 Nationals 2 years ago in Atlanta — 3rd Place Prize
            </p>
          </div>

          {/* Content */}
          <div>
            <h1 className="text-4xl font-semibold">About Coach Aavi</h1>
            
            <div className="mt-4 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4">
              <p className="text-sm text-blue-100">
                <strong>Sophomore (10th Grade)</strong> • Emerald High School, Dublin, CA
              </p>
            </div>

            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              Hi, I'm Aavi. I help beginner and intermediate players improve their tactical vision, positional understanding, opening preparation, and endgame technique through personalized lessons.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Chess.com Rating", "2100"],
                ["USCF Rating", "1700"],
                ["Tournament Experience", "Competitive"],
                ["Played Against Hikaru Nakamura", "Yes"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-slate-400">{label}</div>
                  <div className="mt-2 text-2xl font-semibold text-yellow-100">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-semibold">Teaching Experience</h2>
              <div className="mt-4 space-y-3 text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">Assistant Coach</p>
                  <p className="text-sm">Fallon Chess Club & Emerald Hills Chess Club</p>
                  <p className="text-sm text-slate-400">Top Level Class (Elite class)</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold">Skills I Teach</h2>
              <ul className="mt-4 space-y-3 text-slate-300">
                <li>✓ Tactical Vision Development</li>
                <li>✓ Positional Understanding</li>
                <li>✓ Opening Preparation</li>
                <li>✓ Endgame Technique</li>
                <li>✓ Tournament Preparation</li>
              </ul>
            </div>

            <Link href="/#booking" className="mt-8 inline-flex rounded-full bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400">
              Book a Lesson
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
