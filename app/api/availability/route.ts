function getSupabaseClient() {
  const { createClient } = require("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "aavi123";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    const supabase = getSupabaseClient();

    if (date) {
      const { data, error } = await supabase
        .from("availability")
        .select("time_slot, is_booked")
        .eq("date", date)
        .eq("is_available", true)
        .order("time_slot");

      if (error) throw error;

      const availableSlots = data
        .filter((slot: any) => !slot.is_booked)
        .map((slot: any) => slot.time_slot);

      return Response.json({ availableSlots });
    }

    return Response.json({ error: "Date parameter required" }, { status: 400 });
  } catch (error) {
    console.error("Availability error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password, action, date, timeSlots } = body;

    if (password !== ADMIN_PASSWORD) {
      return Response.json({ error: "Invalid password" }, { status: 401 });
    }

    const supabase = getSupabaseClient();

    if (action === "set_available") {
      // Set specific date/time slots as available
      const slotsToInsert = timeSlots.map((time: string) => ({
        date,
        time_slot: time,
        is_available: true,
        is_booked: false,
      }));

      const { error } = await supabase
        .from("availability")
        .upsert(slotsToInsert, { onConflict: "date,time_slot" });

      if (error) throw error;

      return Response.json({ success: true, message: "Availability updated" });
    }

    if (action === "remove_date") {
      // Remove a date from availability
      const { error } = await supabase
        .from("availability")
        .delete()
        .eq("date", date);

      if (error) throw error;

      return Response.json({ success: true, message: "Date removed" });
    }

    if (action === "block_date") {
      // Block an entire date
      const { error } = await supabase
        .from("availability")
        .update({ is_available: false })
        .eq("date", date);

      if (error) throw error;

      return Response.json({ success: true, message: "Date blocked" });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Availability update error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to update availability" },
      { status: 500 }
    );
  }
}
