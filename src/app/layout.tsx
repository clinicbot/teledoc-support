import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tele-Derm Support Desk",
  description: "Report problems and track support tickets for the tele-dermatology platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                +
              </span>
              <span>Tele-Derm Support</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/new"
                className="text-slate-700 hover:text-teal-700"
              >
                Report a problem
              </Link>
              <Link
                href="/support"
                className="text-slate-700 hover:text-teal-700"
              >
                Support team
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-4 text-xs text-slate-500">
            Tele-Derm Support Desk
          </div>
        </footer>
      </body>
    </html>
  );
}
