import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import ical from "ical-generator";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      parentName,
      studentName,
      email,
      phone,
      lessonType,
      lessonLength,
      address,
      notes,
      date,
      time,
      totalCost,
    } = body;

    // Store booking in Supabase
    const { data: booking, error: insertError } = await supabase
      .from("bookings")
      .insert({
        parent_name: parentName,
        student_name: studentName,
        email,
        phone,
        lesson_type: lessonType,
        lesson_length: lessonLength,
        address,
        notes,
        date,
        time,
        total_cost: totalCost,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) throw new Error(`Database error: ${insertError.message}`);

    // Send email to Aavi via Resend
    await resend.emails.send({
      from: "noreply@chesstutoring.com",
      to: "aavipb07@gmail.com",
      subject: `New Chess Lesson Booking: ${studentName}`,
      html: `
        <h2>New Booking Received</h2>
        <p><strong>Parent Name:</strong> ${parentName}</p>
        <p><strong>Student Name:</strong> ${studentName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Lesson Type:</strong> ${lessonType}</p>
        <p><strong>Duration:</strong> ${lessonLength} hours</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Address:</strong> ${address || "N/A"}</p>
        <p><strong>Notes:</strong> ${notes || "None"}</p>
        <p><strong>Total Cost:</strong> $${totalCost.toFixed(2)}</p>
      `,
    });

    // Send confirmation email to customer
    await resend.emails.send({
      from: "noreply@chesstutoring.com",
      to: email,
      subject: "Chess Lesson Booking Confirmation",
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Hi ${parentName},</p>
        <p>Your chess lesson has been booked successfully.</p>
        <p><strong>Lesson Details:</strong></p>
        <p>Student: ${studentName}</p>
        <p>Type: ${lessonType}</p>
        <p>Date: ${date} at ${time}</p>
        <p>Duration: ${lessonLength} hours</p>
        <p>Total: $${totalCost.toFixed(2)}</p>
        <p>We look forward to seeing you!</p>
      `,
    });

    // Send Discord notification to Aavi (free alternative to SMS)
    if (process.env.DISCORD_WEBHOOK_URL) {
      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "Chess Tutor Bookings",
          avatar_url: "https://cdn-icons-png.flaticon.com/512/881/881294.png",
          embeds: [
            {
              color: 3447003,
              title: `New Lesson Booking: ${studentName}`,
              fields: [
                { name: "Parent", value: parentName, inline: true },
                { name: "Student", value: studentName, inline: true },
                { name: "Email", value: email, inline: false },
                { name: "Phone", value: phone, inline: true },
                { name: "Lesson Type", value: lessonType, inline: true },
                { name: "Date & Time", value: `${date} at ${time}`, inline: false },
                { name: "Duration", value: `${lessonLength} hours`, inline: true },
                { name: "Total Cost", value: `$${totalCost.toFixed(2)}`, inline: true },
                { name: "Address", value: address || "Virtual", inline: false },
                { name: "Notes", value: notes || "None", inline: false },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });
    }

    // Generate iCal file for calendar import (free alternative to Google Calendar API)
    const cal = ical({ name: "Chess Lesson" });
    const [year, month, day] = date.split("-");
    const startTime = new Date(`${year}-${month}-${day}T${convertTo24Hour(time)}`);
    const endTime = new Date(startTime.getTime() + lessonLength * 60 * 60 * 1000);

    cal.createEvent({
      start: startTime,
      end: endTime,
      summary: `Chess Lesson: ${studentName}`,
      description: `${lessonType}\nParent: ${parentName}\nEmail: ${email}\nPhone: ${phone}\nNotes: ${notes}`,
      location: address || "Virtual",
    });

    // Send calendar file as attachment
    await resend.emails.send({
      from: "noreply@chesstutoring.com",
      to: email,
      subject: "Add to Calendar - Chess Lesson Booking",
      html: `<p>You can import the attached calendar file into Google Calendar, Outlook, or Apple Calendar.</p>`,
      attachments: [
        {
          filename: `chess-lesson-${date}.ics`,
          content: cal.toString(),
        },
      ],
    });

    return Response.json({
      success: true,
      booking,
      message: "Booking confirmed. Emails sent, Discord notification delivered, and calendar file created.",
    });
  } catch (error) {
    console.error("Booking error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Booking failed" },
      { status: 500 }
    );
  }
}

function convertTo24Hour(time12h: string): string {
  const [time, period] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
