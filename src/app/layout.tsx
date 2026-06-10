import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Library Loop",
  description: "A three-action onchain reading desk for Base.",
  other: {
    "base:app_id": "6a27e446109b9af1bf2419ec",
    "talentapp:project_verification":
      "4ff207efb60ad67823ea4c63c5793f0a650dff41623f196fbbc5820b19a3692d22498c35ffba7fb5eeba8e3888b94c70d3997b693784643a98922e202543fa46",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
