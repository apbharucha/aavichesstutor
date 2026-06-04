"use client";

import { useEffect, useMemo, useState } from "react";
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

type SlotStatus = "available" | "booked";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [slotState, setSlotState] = useState<Record<string, SlotStatus>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !selectedDate) return;

    const loadSlots = async () => {
      try {
        const response = await fetch(`/api/availability?date=${selectedDate}&full=1`);
        const data = await response.json();

        const nextState: Record<string, SlotStatus> = {};
        (data.slots ?? []).forEach((slot: { slot: string; booked: boolean; available: boolean }) => {
          if (slot.available) nextState[slot.slot] = slot.booked ? "booked" : "available";
        });

        setSlotState(nextState);
      } catch (error) {
        console.error("Failed to load slots:", error);
        setMessage("Failed to load availability for that date.");
      }
    };

    loadSlots();
  }, [isAuthenticated, selectedDate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "aavi123")) {
      setIsAuthenticated(true);
      setMessage("Logged in successfully");
      setPassword("");
    } else {
      setMessage("Invalid password");
    }
  };

  const setSlot = (slot: string, status: SlotStatus) => {
    setSlotState((prev) => ({ ...prev, [slot]: status }));
  };

  const payloadSlots = useMemo(
    () => Object.entries(slotState).map(([slot, status]) => ({ slot, booked: status === "booked" })),
    [slotState]
  );

  const saveSlots = async (e: React.FormEvent) => {
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
          action: "save_slots",
          date: selectedDate,
          slots: payloadSlots,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update availability");

      setMessage("Availability updated successfully");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update availability");
    } finally {
      setLoading(false);
    }
  };

  const blockDate = async () => {
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

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to block date");

      setSlotState({});
      setMessage("Date blocked");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to block date");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#07111f] px-6 text-white flex items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-3xl font-semibold">Admin Login</h1>
          <label className="mt-6 grid gap-2">
            <span className="text-sm text-slate-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 outline-none"
              placeholder="Enter admin password"
            />
          </label>
          <button type="submit" className="mt-4 w-full rounded-2xl bg-blue-500 px-6 py-3 font-semibold text-white">
            Login
          </button>
          {message && <p className="mt-4 text-sm text-slate-300">{message}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/95 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <Link href="/" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
            Back to Home
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={saveSlots} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Edit Availability</h2>

            <label className="mt-6 grid gap-2">
              <span className="text-sm text-slate-300">Date</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 outline-none"
              />
            </label>

            <div className="mt-6 grid gap-3">
              {TIME_SLOTS.map((slot) => {
                const status = slotState[slot];
                return (
                  <div key={slot} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <div className="font-medium">{slot}</div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSlot(slot, "available")}
                        className={`rounded-full px-3 py-1 text-sm ${
                          status === "available" ? "bg-blue-500 text-white" : "border border-white/15 bg-white/5 text-slate-300"
                        }`}
                      >
                        Available
                      </button>
                      <button
                        type="button"
                        onClick={() => setSlot(slot, "booked")}
                        className={`rounded-full px-3 py-1 text-sm ${
                          status === "booked" ? "bg-slate-700 text-white" : "border border-white/15 bg-white/5 text-slate-300"
                        }`}
                      >
                        Booked
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-2xl bg-green-500 px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Availability"}
            </button>
          </form>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Block Entire Date</h2>
            <p className="mt-2 text-slate-300">This removes all slots for the selected date.</p>

            <button
              type="button"
              onClick={blockDate}
              disabled={loading || !selectedDate}
              className="mt-6 rounded-2xl bg-red-500 px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Working..." : "Block Date"}
            </button>

            <div className="mt-8 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4 text-sm text-yellow-100">
              Access this page at: <span className="font-semibold">/admin</span>
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-200">
            {message}
          </div>
        )}
      </section>
    </main>
  );
}
