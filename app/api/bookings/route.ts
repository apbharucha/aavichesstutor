import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import twilio from "twilio";
import { google } from "googleapis";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

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

    // Send email to Aavi
    const aaviBcc = "aavipb07@gmail.com";
    await resend.emails.send({
      from: "noreply@chesstutoring.com",
      to: aaviBcc,
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

    // Send SMS notification to Aavi
    await twilioClient.messages.create({
      body: `New lesson booking: ${studentName} on ${date} at ${time}. Total: $${totalCost.toFixed(2)}. Check email for details.`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: process.env.AAVI_PHONE_NUMBER!,
    });

    // Create Google Calendar event
    const [year, month, day] = date.split("-");
    const startTime = new Date(`${year}-${month}-${day}T${convertTo24Hour(time)}`);
    const endTime = new Date(startTime.getTime() + lessonLength * 60 * 60 * 1000);

    await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: `Chess Lesson: ${studentName}`,
        description: `${lessonType}\nParent: ${parentName}\nEmail: ${email}\nPhone: ${phone}\nNotes: ${notes}`,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
        location: address || "Virtual",
      },
    });

    return Response.json({
      success: true,
      booking,
      message: "Booking confirmed. Emails sent and calendar event created.",
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
