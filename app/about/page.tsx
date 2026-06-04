import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <nav className="border-b border-white/10 bg-black/20 px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="text-2xl font-semibold">
            Aavi Chess Tutor
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-slate-300 hover:text-white">Home</Link>
            <Link href="/lessons" className="text-slate-300 hover:text-white">Lessons</Link>
            <Link href="/faq" className="text-slate-300 hover:text-white">FAQ</Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="aspect-[4/5] rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.35),rgba(234,179,8,0.18))] p-6">
              <div className="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-[#07111f]/70 text-center text-3xl font-semibold">
                Aavi
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-semibold">About Coach Aavi</h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              Hi, I'm Aavi. I help beginner and intermediate players improve their tactical vision, positional understanding, opening preparation, and endgame technique through personalized lessons.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
