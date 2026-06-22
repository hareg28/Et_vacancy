import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Et_vacancy – Find Your Dream Job in Ethiopia & Beyond",
  description: "Ethiopia's premier job vacancy platform. Discover verified job openings, connect with top employers, and accelerate your career.",
  keywords: "jobs, vacancy, Ethiopia, employment, career, hiring",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
