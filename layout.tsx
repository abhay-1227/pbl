import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PantryPilot AI - Your Personal Nutrition & Wellness Companion",
  description: "Smart recipe generation with personalized nutrition tracking, calorie management, and traditional Indian yoga exercises - all in one comprehensive wellness platform.",
  keywords: ["Nutrition", "Recipe Generator", "Yoga", "Health", "Wellness", "AI", "Calories", "Indian Yoga", "Meal Planning"],
  authors: [{ name: "PantryPilot AI Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "PantryPilot AI - Nutrition & Wellness Platform",
    description: "Transform your pantry into healthy meals with AI-powered recipe generation and nutrition tracking",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PantryPilot AI",
    description: "AI-powered nutrition and wellness platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
