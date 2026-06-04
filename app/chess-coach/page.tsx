"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type LessonType = "Virtual" | "At Coach's House" | "At Student's House";
type Duration = 1 | 1.5 | 2;

type BookingForm = {
  parentName: string;
  studentName: string;
  numberOfStudents: number;
  email: string;
  phone: string;
  lessonType: LessonType;
  lessonLength: Duration;
  address: string;
  notes: string;
};

export default function ChessCoachLandingPage() {
  const viewMonth = new Date(2026, 5, 1);
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 5, 15));
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<BookingForm>({
    parentName: "",
    studentName: "",
    numberOfStudents: 1,
    email: "",
    phone: "",
    lessonType: "Virtual",
    lessonLength: 1,
    address: "",
    notes: "",
  });
  const [availability, setAvailability] = useState<Record<string, string[]>>({});

  const selectedKey = formatKey(selectedDate);
  const availableSlots = availability[selectedKey] ?? [];
  const isBooked = availableSlots.length === 0;

  useEffect(() => {
    setSelectedSlot(availableSlots[0] ?? "");
  }, [selectedKey]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`/api/availability?date=${selectedKey}`);
        const data = await response.json();
        setAvailability((prev) => ({
          ...prev,
          [selectedKey]: data.availableSlots || [],
        }));
      } catch (error) {
        console.error("Failed to fetch availability:", error);
      }
    };

    fetchAvailability();
  }, [selectedKey]);

  const total = useMemo(() => {
    const rate = form.lessonType === "At Student's House" ? 45 : 40;
    const basePrice = rate * Number(form.lessonLength);
    const extraStudentCost = (form.numberOfStudents - 1) * 25;
    return basePrice + extraStudentCost;
  }, [form.lessonType, form.lessonLength, form.numberOfStudents]);

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
          numberOfStudents: 1,
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
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/95 backdrop-blur-md px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="text-2xl font-semibold">
            Aavi Chess Tutor
          </Link>
          <div className="flex gap-6">
            <Link href="/about" className="text-slate-300 hover:text-white transition">About</Link>
            <Link href="/lessons" className="text-slate-300 hover:text-white transition">Lessons</Link>
            <Link href="/faq" className="text-slate-300 hover:text-white transition">FAQ</Link>
            <a href="#booking" className="text-slate-300 hover:text-white transition">Book</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.16),transparent_34%),linear-gradient(180deg,#0a1730_0%,#07111f_100%)]">
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
              <Link
                href="#booking"
                className="rounded-full bg-blue-500 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400"
              >
                Book Lesson
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-white/15 bg-white/5 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                About Coach
              </Link>
              <Link
                href="/lessons"
                className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-8 py-3 font-semibold text-yellow-100 transition hover:bg-yellow-400/15"
              >
                Lesson Types
              </Link>
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
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Calendar */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-3xl font-semibold">Booking Calendar</h2>
            <p className="mt-2 text-slate-300">Select your preferred date and time</p>

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

          {/* Form */}
          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6">
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
                    className="rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 outline-none"
                  />
                </label>
              ))}

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">Number of Students</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={form.numberOfStudents}
                  onChange={(e) => setForm({ ...form, numberOfStudents: Number(e.target.value) })}
                  className="rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 outline-none"
                />
              </label>

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
              <div className="mt-2 text-3xl font-semibold text-yellow-100">${total.toFixed(2)}</div>
              <div className="mt-2 text-sm text-slate-300">
                Base: ${form.lessonType === "At Student's House" ? 45 : 40}/hour • Extra students: $25 each
              </div>
              {form.numberOfStudents > 1 && (
                <div className="mt-2 text-sm text-slate-300">
                  {form.numberOfStudents - 1} additional student{form.numberOfStudents > 2 ? "s" : ""}: ${((form.numberOfStudents - 1) * 25).toFixed(2)}
                </div>
              )}
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
                Booking submitted! Check your email for confirmation.
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20">
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
            <div className="text-lg font-semibold">Navigation</div>
            <div className="mt-3 flex flex-col gap-2 text-slate-300">
              <Link href="/about" className="hover:text-white">About</Link>
              <Link href="/lessons" className="hover:text-white">Lessons</Link>
              <Link href="/faq" className="hover:text-white">FAQ</Link>
              <Link href="/admin/info" className="hover:text-white text-sm text-slate-400">Admin Info</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function formatKey(date: Date) {
  const y = date.getFullYear(); const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function money(value: number) {
  return `$${value.toFixed(2)}`;
}
async function submitBooking(form: BookingForm, selectedDate: Date, selectedSlot: string, total: number) {
  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parentName: form.parentName,
        studentName: form.studentName,
        numberOfStudents: form.numberOfStudents,
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
