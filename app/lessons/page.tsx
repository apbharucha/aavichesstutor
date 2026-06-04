import Link from "next/link";

const lessonCards = [
  { title: "Virtual Lessons", meta: "Zoom / Google Meet", price: "$40/hour", desc: "Learn from anywhere with interactive analysis on screen" },
  { title: "At My House", meta: "In-person", price: "$40/hour", desc: "Personal coaching in a dedicated study space" },
  { title: "At Your House", meta: "Travel included", price: "$45/hour", desc: "I come to you for personalized one-on-one training" },
];

export default function LessonsPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <nav className="border-b border-white/10 bg-black/20 px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="text-2xl font-semibold">
            Aavi Chess Tutor
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-slate-300 hover:text-white">Home</Link>
            <Link href="/about" className="text-slate-300 hover:text-white">About</Link>
            <Link href="/faq" className="text-slate-300 hover:text-white">FAQ</Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h1 className="text-4xl font-semibold">Lesson Types</h1>
        <p className="mt-4 text-lg text-slate-300">Choose the format that works best for you</p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {lessonCards.map((card) => (
            <div key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-2xl font-semibold">{card.title}</div>
              <div className="mt-2 text-sm text-slate-400">{card.meta}</div>
              <div className="mt-4 text-slate-300">{card.desc}</div>
              <div className="mt-6 inline-flex rounded-full border border-yellow-400/25 bg-yellow-400/10 px-4 py-2 text-lg font-semibold text-yellow-100">
                {card.price}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold">Pricing Details</h2>
          <div className="mt-6 space-y-4 text-slate-300">
            <p><strong>Base Rate:</strong> $40/hour for Virtual or At My House</p>
            <p><strong>Travel Rate:</strong> $45/hour for At Your House (includes travel)</p>
            <p><strong>Multiple Students:</strong> Add $25 per additional student</p>
            <p className="mt-4 pt-4 border-t border-white/10">
              <strong>Examples:</strong>
            </p>
            <ul className="mt-2 space-y-2 ml-4">
              <li>• 1 hour virtual for 1 student = $40</li>
              <li>• 1.5 hour virtual for 2 students = $40 + $37.50 = $77.50</li>
              <li>• 2 hour at your house for 3 students = $90 + $50 = $140</li>
            </ul>
          </div>
        </div>

        <Link href="/#booking" className="mt-12 inline-flex rounded-full bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400">
          Book Now
        </Link>
      </section>
    </main>
  );
}
