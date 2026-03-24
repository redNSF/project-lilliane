import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Motionbrief | Script-to-Motion Design Brief Generator",
  description: "Turn your script into a professional motion design brief instantly powered by Groq.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-[#0a0a0a] cursor-none" suppressHydrationWarning>
        <CustomCursor />
        <div className={`${geistSans.variable} ${jetbrainsMono.variable} main-wrapper`}>
          {children}
        </div>
      </body>
    </html>
  );
}
