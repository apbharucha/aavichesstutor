"use client";

import { useEffect, useMemo, useState } from "react";

type LessonType = "Virtual" | "At Coach's House" | "At Student's House";
type Duration = 1 | 1.5 | 2;

type BookingForm = {
  parentName: string;
  studentName: string;
  email: string;
  phone: string;
  lessonType: LessonType;
  lessonLength: Duration;
  address: string;
  notes: string;
};

const availability: Record<string, string[]> = {
  "2026-06-15": ["3:00 PM", "4:00 PM", "5:00 PM"],
  "2026-06-16": [],
  "2026-06-18": ["2:00 PM", "3:30 PM", "6:00 PM"],
  "2026-06-21": ["10:00 AM", "12:00 PM"],
  "2026-06-24": ["4:30 PM", "5:30 PM"],
};

const testimonials = [
  "Aavi helped me gain 300 rating points in three months.",
  "My tactical vision improved significantly.",
];

const faqs = [
  ["What rating levels do you teach?", "Beginners to intermediate tournament players."],
  ["Are lessons online?", "Yes."],
  ["Do you travel?", "Yes, for $45/hour lessons."],
  ["How do payments work?", "Venmo, Zelle, Cash, etc."],
];

const lessonCards = [
  { title: "Virtual Lessons", meta: "Zoom / Google Meet", price: "$40/hour" },
  { title: "At My House", meta: "In-person", price: "$40/hour" },
  { title: "At Your House", meta: "Travel included", price: "$45/hour" },
];

function formatKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

async function submitBooking(form: BookingForm, selectedDate: Date, selectedSlot: string, total: number) {
  try {
    // Call backend API to handle Supabase, Resend, Twilio, and Google Calendar
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parentName: form.parentName,
        studentName: form.studentName,
        email: form.email,
        phone: form.phone,
        lessonType: form.lessonType,
        lessonLength: form.lessonLength,
        address: form.address,
        notes: form.notes,
        date: selectedDate.toISOString().split("T")[0],
        time: selectedSlot,
        totalCost: total,
      }),
    });

    if (!response.ok) throw new Error("Booking failed");
    return await response.json();
  } catch (error) {
    console.error("Error submitting booking:", error);
    throw error;
  }
}

export default function ChessCoachLandingPage() {
  const viewMonth = new Date(2026, 5, 1);
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 5, 15));
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<BookingForm>({
    parentName: "",
    studentName: "",
    email: "",
    phone: "",
    lessonType: "Virtual",
    lessonLength: 1,
    address: "",
    notes: "",
  });

  const selectedKey = formatKey(selectedDate);
  const availableSlots = availability[selectedKey] ?? [];
  const isBooked = availableSlots.length === 0;

  useEffect(() => {
    setSelectedSlot(availableSlots[0] ?? "");
  }, [selectedKey]);

  const total = useMemo(() => {
    const rate = form.lessonType === "At Student's House" ? 45 : 40;
    return rate * Number(form.lessonLength);
  }, [form.lessonType, form.lessonLength]);

  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i + 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitBooking(form, selectedDate, selectedSlot, total);
      setSubmitted(true);
      setTimeout(() => {
        setForm({
          parentName: "",
          studentName: "",
          email: "",
          phone: "",
          lessonType: "Virtual",
          lessonLength: 1,
          address: "",
          notes: "",
        });
        setSelectedSlot("");
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const cells = [...Array(firstDay).fill(null), ...days];

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <style jsx global>{`
        @keyframes drift {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(16px, -18px, 0) rotate(8deg);
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
        }
        @keyframes glide {
          0% {
            transform: translateX(-20px);
          }
          50% {
            transform: translateX(20px);
          }
          100% {
            transform: translateX(-20px);
          }
        }
        @keyframes boardPulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.55;
          }
        }
      `}</style>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.16),transparent_34%),linear-gradient(180deg,#0a1730_0%,#07111f_100%)]">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(59,130,246,0.18)_1px,transparent_1px)] bg-[size:22px_22px] animate-[boardPulse_8s_ease-in-out_infinite]" />
        </div>

        <div className="absolute left-8 top-16 text-5xl opacity-30 animate-[drift_12s_ease-in-out_infinite]">♞</div>
        <div className="absolute right-12 top-28 text-6xl opacity-30 animate-[drift_14s_ease-in-out_infinite]">♛</div>
        <div className="absolute left-1/3 bottom-10 text-4xl opacity-25 animate-[glide_10s_ease-in-out_infinite]">♟</div>
        <div className="absolute right-1/3 bottom-24 text-4xl opacity-25 animate-[glide_12s_ease-in-out_infinite]">♜</div>

        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1 text-sm font-medium text-yellow-200">
              Personalized chess coaching
            </span>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">
              Improve Your Chess With Personalized Coaching
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-300">
              2100 Chess.com Rating • 1700 USCF Rating • Competitive Tournament Experience • Played Against Hikaru Nakamura
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#booking" className="rounded-full bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400">
                Book Lesson
              </a>
              <a href="#contact" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                Contact Coach
              </a>
              <a href="#about" className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-6 py-3 font-semibold text-yellow-100 transition hover:bg-yellow-400/15">
                About Coach
              </a>
            </div>
          </div>

          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="grid grid-cols-8 gap-1 rounded-2xl border border-white/10 bg-[#0a1424] p-2">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-md ${((Math.floor(i / 8) + i) % 2 === 0 ? "bg-[#b7d3ff]/10" : "bg-[#03101f]")}`}
                />
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-7xl opacity-20">
              ♞ ♛ ♜ ♟
            </div>
            <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-gradient-to-r from-yellow-400/10 to-blue-500/10 p-4 text-sm text-slate-200">
              Elegant blue/gold theme with subtle board texture, floating pieces, and a coaching-first booking flow.
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="aspect-[4/5] rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.35),rgba(234,179,8,0.18))] p-6">
              <div className="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-[#07111f]/70 text-center text-3xl font-semibold">
                Aavi
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-semibold">About Coach</h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              Hi, I'm Aavi. I help beginner and intermediate players improve their tactical vision, positional understanding, opening preparation, and endgame technique through personalized lessons.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          </div>
        </div>
      </section>

      {/* Lessons */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="text-3xl font-semibold">Lesson Types</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {lessonCards.map((card) => (
            <div key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-xl font-semibold">{card.title}</div>
              <div className="mt-2 text-slate-300">{card.meta}</div>
              <div className="mt-6 inline-flex rounded-full border border-yellow-400/25 bg-yellow-400/10 px-4 py-2 text-lg font-semibold text-yellow-100">
                {card.price}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-semibold">Booking Calendar</h2>
                <p className="mt-2 text-slate-300">Monthly view with live availability.</p>
              </div>
              <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-300">
                June 2026
              </div>
            </div>

            <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.2em] text-slate-400">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-7 gap-2">
              {cells.map((day, index) => {
                if (!day) return <div key={`empty-${index}`} className="aspect-square rounded-2xl border border-transparent" />;

                const key = formatKey(day);
                const slots = availability[key] ?? [];
                const available = slots.length > 0;
                const selected = key === selectedKey;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => available && setSelectedDate(day)}
                    className={[
                      "aspect-square rounded-2xl border p-2 text-left transition",
                      selected ? "border-white bg-white text-slate-900" : "",
                      available && !selected ? "border-blue-400/50 bg-blue-500/15 hover:bg-blue-500/25" : "",
                      !available ? "cursor-not-allowed border-white/5 bg-white/5 text-slate-500 opacity-50" : "",
                    ].join(" ")}
                  >
                    <div className="text-sm font-semibold">{day.getDate()}</div>
                    <div className="mt-1 text-[11px]">{available ? "Available" : "Booked"}</div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-lg font-semibold">
                {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
              </div>

              {isBooked ? (
                <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300">
                  Unavailable
                  <span className="ml-2 text-slate-500">(Grey)</span>
                </div>
              ) : (
                <div className="mt-3">
                  <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Available</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={[
                          "rounded-full px-4 py-2 text-sm font-medium transition",
                          selectedSlot === slot
                            ? "bg-white text-slate-900"
                            : "border border-blue-300/30 bg-blue-500/15 text-blue-100 hover:bg-blue-500/25",
                        ].join(" ")}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <form id="booking-form" onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-3xl font-semibold">Booking Form</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Parent/Student Name", "parentName"],
                ["Student Name", "studentName"],
                ["Email", "email"],
                ["Phone Number", "phone"],
              ].map(([label, key]) => (
                <label key={label} className="grid gap-2">
                  <span className="text-sm text-slate-300">{label}</span>
                  <input
                    required
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value } as BookingForm)}
                    className="rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 outline-none ring-0 placeholder:text-slate-500"
                  />
                </label>
              ))}

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">Lesson Type</span>
                <select
                  value={form.lessonType}
                  onChange={(e) => setForm({ ...form, lessonType: e.target.value as LessonType })}
                  className="rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 outline-none"
                >
                  <option value="Virtual">Virtual</option>
                  <option value="At Coach's House">At Coach's House</option>
                  <option value="At Student's House">At Student's House</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">Lesson Length</span>
                <select
                  value={form.lessonLength}
                  onChange={(e) => setForm({ ...form, lessonLength: Number(e.target.value) as Duration })}
                  className="rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 outline-none"
                >
                  <option value={1}>1 hour</option>
                  <option value={1.5}>1.5 hours</option>
                  <option value={2}>2 hours</option>
                </select>
              </label>

              <label className="grid gap-2 sm:col-span-2">
                <span className="text-sm text-slate-300">Date</span>
                <input
                  value={selectedDate.toLocaleDateString("en-CA")}
                  readOnly
                  className="rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-slate-300 outline-none"
                />
              </label>

              <label className="grid gap-2 sm:col-span-2">
                <span className="text-sm text-slate-300">Time Slot</span>
                <input
                  value={selectedSlot}
                  readOnly
                  className="rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-slate-300 outline-none"
                />
              </label>

              <label className="grid gap-2 sm:col-span-2">
                <span className="text-sm text-slate-300">Address</span>
                <input
                  required={form.lessonType === "At Student's House"}
                  disabled={form.lessonType !== "At Student's House"}
                  placeholder={form.lessonType === "At Student's House" ? "Required for home visits" : "Only required for At Student's House"}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </label>

              <label className="grid gap-2 sm:col-span-2">
                <span className="text-sm text-slate-300">Additional Notes</span>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 outline-none"
                />
              </label>
            </div>

            <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5">
              <div className="text-sm uppercase tracking-[0.2em] text-yellow-200">Automatic Pricing</div>
              <div className="mt-2 text-3xl font-semibold text-yellow-100">{money(total)}</div>
              <div className="mt-2 text-sm text-slate-300">
                Virtual: $40 × hours • My House: $40 × hours • Your House: $45 × hours
              </div>
              <div className="mt-3 text-sm text-slate-300">
                Examples: 1 hour virtual = $40 • 1.5 hour home visit = $67.50 • 2 hour home visit = $90
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedSlot}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-blue-500 to-yellow-400 px-6 py-4 font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Book Lesson
            </button>

            {submitted && (
              <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-100">
                Booking submitted. Backend hooks can send email to aavipb07@gmail.com, create a Google Calendar event, notify via SMS, and mark the slot unavailable immediately.
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Testimonials / FAQ / Workflow */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-2xl font-semibold">Testimonials</h3>
            <div className="mt-4 space-y-4">
              {testimonials.map((t) => (
                <div key={t} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-slate-200">
                  “{t}”
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-2xl font-semibold">FAQ</h3>
            <div className="mt-4 space-y-4">
              {faqs.map(([q, a]) => (
                <div key={q} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="font-medium">{q}</div>
                  <div className="mt-2 text-slate-300">{a}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-2xl font-semibold">Technical Workflow</h3>
            <ol className="mt-4 space-y-3 text-slate-300">
              {[
                "User chooses date",
                "System checks database",
                "Available slots shown in blue",
                "User selects slot",
                "Completes booking form",
                "Price automatically calculated",
                "Booking stored in database",
                "Email sent to Aavi",
                "SMS notification sent to Aavi",
                "Confirmation email sent to customer",
                "Slot becomes grey/unavailable",
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="text-yellow-200">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/10 bg-black/20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
          <div>
            <div className="text-lg font-semibold">Contact</div>
            <div className="mt-3 text-slate-300">Email: aavipb07@gmail.com</div>
            <div className="mt-2 text-slate-300">Phone: 925-997-5107</div>
          </div>
          <div>
            <div className="text-lg font-semibold">Hours</div>
            <div className="mt-3 text-slate-300">Monday–Sunday by appointment</div>
          </div>
          <div>
            <div className="text-lg font-semibold">Suggested Stack</div>
            <div className="mt-3 text-slate-300">Next.js • Tailwind CSS • Supabase • FullCalendar • Resend • Twilio • Vercel</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
