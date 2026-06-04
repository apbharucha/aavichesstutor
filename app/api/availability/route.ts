async function getSupabaseClient() {
  const { createClient } = await import("@supabase/supabase-js");

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "";

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel."
    );
  }

  return createClient(url, key);
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "aavi123";

export async function GET(req: Request) {
  try {
    const supabase = await getSupabaseClient();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const full = searchParams.get("full") === "1";

    if (!date) {
      return Response.json(full ? { slots: [] } : { availableSlots: [] });
    }

    const { data, error } = await supabase
      .from("availability")
      .select("time_slot, is_available, is_booked")
      .eq("date", date)
      .order("time_slot");

    if (error) throw error;

    const slots = (data ?? []).map((row: any) => ({
      slot: row.time_slot,
      available: Boolean(row.is_available),
      booked: Boolean(row.is_booked),
    }));

    return Response.json(
      full
        ? { slots }
        : {
            availableSlots: slots
              .filter((slot) => slot.available && !slot.booked)
              .map((slot) => slot.slot),
          }
    );
  } catch (error) {
    console.error("Availability GET error:", error);
    return Response.json(
      { availableSlots: [], slots: [], error: error instanceof Error ? error.message : "Failed to load availability" },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await getSupabaseClient();
    const body = await req.json();
    const { password, action, date, slots } = body;

    if (password !== ADMIN_PASSWORD) {
      return Response.json({ error: "Invalid password" }, { status: 401 });
    }

    if (action === "save_slots") {
      if (!date) return Response.json({ error: "Date is required" }, { status: 400 });

      await supabase.from("availability").delete().eq("date", date);

      const rows = (slots ?? []).map((slot: { slot: string; booked: boolean }) => ({
        date,
        time_slot: slot.slot,
        is_available: true,
        is_booked: Boolean(slot.booked),
      }));

      if (rows.length > 0) {
        const { error: insertError } = await supabase.from("availability").insert(rows);
        if (insertError) throw insertError;
      }

      return Response.json({ success: true, message: "Availability updated" });
    }

    if (action === "block_date") {
      if (!date) return Response.json({ error: "Date is required" }, { status: 400 });

      const { error } = await supabase.from("availability").delete().eq("date", date);
      if (error) throw error;

      return Response.json({ success: true, message: "Date blocked" });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Availability POST error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to update availability" },
      { status: 500 }
    );
  }
}
