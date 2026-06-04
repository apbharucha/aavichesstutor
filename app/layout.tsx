import type { Metadata } from "next";
import Link from "next/link";
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
      <body>
        {/* Global Navigation */}
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/95 backdrop-blur-md px-6 py-4">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <Link href="/" className="text-2xl font-semibold text-white">
              Aavi Chess Tutor
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="text-slate-300 hover:text-white transition">Home</Link>
              <Link href="/about" className="text-slate-300 hover:text-white transition">About</Link>
              <Link href="/lessons" className="text-slate-300 hover:text-white transition">Lessons</Link>
              <Link href="/faq" className="text-slate-300 hover:text-white transition">FAQ</Link>
              <a href="/#booking" className="text-slate-300 hover:text-white transition">Book</a>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
