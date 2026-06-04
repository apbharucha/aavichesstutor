"use client";

import { useState } from "react";
import Link from "next/link";

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === "aavi123") {
      setIsAuthenticated(true);
      setMessage("Logged in successfully");
    } else {
      setMessage("Invalid password");
    }
  };

  const toggleSlot = (slot: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleSetAvailable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || selectedSlots.length === 0) {
      setMessage("Please select a date and at least one time slot");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          action: "set_available",
          date: selectedDate,
          timeSlots: selectedSlots,
        }),
      });

      if (!response.ok) throw new Error("Failed to update availability");

      setMessage(`✓ Made ${selectedDate} available with ${selectedSlots.length} slots`);
      setSelectedSlots([]);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Failed to update"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      setMessage("Please select a date");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          action: "block_date",
          date: selectedDate,
        }),
      });

      if (!response.ok) throw new Error("Failed to block date");

      setMessage(`✓ Blocked ${selectedDate} from bookings`);
      setSelectedSlots([]);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Failed to block"}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#07111f] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-3xl font-semibold">Admin Login</h1>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="grid gap-2">
              <span className="text-sm text-slate-300">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 outline-none"
                placeholder="Enter admin password"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
            >
              Login
            </button>
          </form>
          {message && (
            <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-3 text-red-100">
              {message}
            </div>
          )}
          <Link href="/" className="mt-6 block text-center text-slate-300 hover:text-white">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <nav className="border-b border-white/10 bg-black/20 px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Set Available Slots */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Add Available Slots</h2>
            <p className="mt-2 text-slate-300">Set which dates and times are available for booking</p>

            <form onSubmit={handleSetAvailable} className="mt-6 space-y-4">
              <label className="grid gap-2">
                <span className="text-sm text-slate-300">Date</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 outline-none"
                />
              </label>

              <div>
                <span className="text-sm text-slate-300">Time Slots</span>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => toggleSlot(slot)}
                      className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                        selectedSlots.includes(slot)
                          ? "bg-blue-500 text-white"
                          : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-400 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Set Available"}
              </button>
            </form>
          </div>

          {/* Block Date */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Block Date</h2>
            <p className="mt-2 text-slate-300">Remove a date from all bookings (e.g., vacation days)</p>

            <form onSubmit={handleBlockDate} className="mt-6 space-y-4">
              <label className="grid gap-2">
                <span className="text-sm text-slate-300">Date to Block</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 outline-none"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-400 disabled:opacity-50"
              >
                {loading ? "Blocking..." : "Block Date"}
              </button>
            </form>
          </div>
        </div>

        {message && (
          <div className={`mt-8 rounded-2xl border p-4 ${
            message.startsWith("✓")
              ? "border-green-400/20 bg-green-400/10 text-green-100"
              : "border-red-400/20 bg-red-400/10 text-red-100"
          }`}>
            {message}
          </div>
        )}

        <Link href="/" className="mt-8 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 transition hover:bg-white/10">
          Back to Home
        </Link>
      </section>
    </main>
  );
}
