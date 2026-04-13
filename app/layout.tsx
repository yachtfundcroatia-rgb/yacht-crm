import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "@/app/context/AdminContext";
import { LanguageProvider } from "@/lib/LanguageContext";
import ScrollToTop from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yacht Fund",
  description: "Premier yacht charter investment fund specializing in the Adriatic Sea.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AdminProvider>
          <LanguageProvider>
            {children}
            <ScrollToTop />
          </LanguageProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
