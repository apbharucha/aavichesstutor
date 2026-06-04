"use client";

import Link from "next/link";
import { useState } from "react";

const faqs = [
  ["What rating levels do you teach?", "Beginners to intermediate tournament players. I specialize in helping players improve from 800 to 1600+ rating."],
  ["Are lessons online?", "Yes, I offer virtual lessons via Zoom or Google Meet. You can also book in-person lessons at my house or yours."],
  ["Do you travel?", "Yes, I travel to your location for $45/hour lessons, which includes travel time."],
  ["How do payments work?", "I accept Venmo, Zelle, and cash payments. Payment details are provided after booking confirmation."],
  ["Can I book multiple students?", "Absolutely! You can book lessons for multiple students at the same time. Each additional student adds $25 to the rate."],
  ["What's your cancellation policy?", "Please provide 24 hours notice for cancellations. Cancellations made less than 24 hours before the lesson may be charged."],
  ["How do I know if the lesson is helping?", "We track your progress through rating improvements, tactical accuracy, and positional understanding. I provide feedback after each lesson."],
];

export default function FAQPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

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
            <Link href="/lessons" className="text-slate-300 hover:text-white">Lessons</Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-semibold">Frequently Asked Questions</h1>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => (
            <button
              key={i}
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{faq[0]}</h3>
                <span className="text-2xl">{expanded === i ? "−" : "+"}</span>
              </div>
              {expanded === i && (
                <p className="mt-4 text-slate-300">{faq[1]}</p>
              )}
            </button>
          ))}
        </div>

        <Link href="/#booking" className="mt-12 inline-flex rounded-full bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400">
          Book a Lesson
        </Link>
      </section>
    </main>
  );
}
