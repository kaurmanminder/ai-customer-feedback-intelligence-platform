import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Feedback Loop - AI Customer Feedback Intelligence",
  description: "Aggregating customer voice and analyzing sentiments using Google Gemini AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="max-w-[100vw] overflow-x-hidden scroll-smooth">
      <body
        className={`${urbanist.variable} antialiased font-sans max-w-[100vw] overflow-x-hidden bg-slate-950 text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
