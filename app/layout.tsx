import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Et_vacancy – Find Your Dream Job in Ethiopia & Beyond",
  description: "Ethiopia&apos;s premier job vacancy platform. Discover verified job openings, connect with top employers, and accelerate your career.",
  keywords: "jobs, vacancy, Ethiopia, employment, career, hiring",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* Inline script to prevent theme flash on reload/restart */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('vacancy-theme');if(t==='dark'||(!t&&true)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
