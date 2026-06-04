import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aavi Chess Tutor - Personalized Coaching",
  description: "Improve your chess with personalized coaching from a 2100-rated coach.",
  openGraph: {
    title: "Aavi Chess Tutor",
    description: "Personalized chess coaching and lesson booking",
    url: "https://aavichesstutor.vercel.app",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
