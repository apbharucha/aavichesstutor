# Aavi Chess Tutor

A modern, full-stack chess coaching booking platform built with Next.js, Tailwind CSS, Supabase, and integrations for email, SMS, and calendar management.

## Features

- **Animated Hero Section** – Elegant blue/gold chess theme with floating pieces
- **Live Booking Calendar** – Interactive monthly view with real-time availability
- **Auto Price Calculation** – Dynamic pricing based on lesson type and duration
- **Email Notifications** – Confirmation emails to customers and notifications to coach
- **SMS Alerts** – Twilio integration for real-time booking notifications
- **Google Calendar Integration** – Automatic event creation for scheduled lessons
- **Database Persistence** – Supabase for secure booking storage
- **Responsive Design** – Mobile-first approach with Tailwind CSS

## Tech Stack

- **Frontend:** Next.js 14+ / React / TypeScript / Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend
- **SMS:** Twilio
- **Calendar:** Google Calendar API
- **Hosting:** Vercel
- **Animations:** Framer Motion / Lottie

## Getting Started

### Prerequisites

- Node.js 18+
- GitHub account
- Supabase account
- Resend account
- Twilio account
- Google Cloud project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aavichesstutor.git
cd aavichesstutor
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file with your credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
AAVI_PHONE_NUMBER=+19259975107
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
aavichesstutor/
├── app/
│   ├── chess-coach/
│   │   └── page.tsx          # Main landing page
│   └── api/
│       └── bookings/
│           └── route.ts       # Booking API endpoint
├── public/                    # Static assets
├── .env.local                 # Environment variables (not committed)
├── tailwind.config.js         # Tailwind CSS config
├── next.config.js             # Next.js config
└── package.json               # Dependencies
```

## API Endpoints

### POST `/api/bookings`

Submit a new chess lesson booking.

**Request Body:**
```json
{
  "parentName": "string",
  "studentName": "string",
  "email": "string",
  "phone": "string",
  "lessonType": "Virtual" | "At Coach's House" | "At Student's House",
  "lessonLength": 1 | 1.5 | 2,
  "address": "string (required for At Student's House)",
  "notes": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM AM/PM",
  "totalCost": "number"
}
```

**Response:**
```json
{
  "success": true,
  "booking": { /* booking object */ },
  "message": "Booking confirmed. Emails sent and calendar event created."
}
```

## Pricing

- Virtual Lessons: $40/hour
- Lessons at Coach's House: $40/hour
- Lessons at Student's House: $45/hour (includes travel)

## Booking Workflow

1. User selects date from calendar
2. Available time slots appear in blue
3. User fills in booking form
4. Price calculated automatically
5. Booking submitted to database
6. Email notification sent to coach
7. Confirmation email sent to customer
8. SMS alert sent to coach
9. Google Calendar event created
10. Time slot marked as unavailable

## Coach Info

- **Chess.com Rating:** 2100
- **USCF Rating:** 1700
- **Tournament Experience:** Competitive
- **Notable:** Played Against Hikaru Nakamura
- **Email:** aavipb07@gmail.com
- **Phone:** 925-997-5107
- **Hours:** Monday–Sunday by appointment

## Deployment

Deploy to Vercel with one click:

```bash
npm run build
vercel deploy
```

Or connect your GitHub repository to Vercel for automatic deployments.

## License

MIT

## Support

For questions or issues, contact aavipb07@gmail.com
