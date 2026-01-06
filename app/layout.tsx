import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider"
import  QueryProvider from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AskCortex",
  description: "AskCortex is your AI-powered research assistant.",
   icons: {
    icon: '/favicon.ico'
  },
  openGraph: {
    title: "AskCortex",
    description: "AskCortex is your AI-powered research assistant.",
    // url: "https://askcortex.vercel.app/",
    url: "http://localhost:3000/",
    siteName: "AskCortex",
    images: [
      {
        url: "./favicon.ico",
        width: 1200,
        height: 630,
        alt: "AskCortex",
      },
    ],
    locale: "en_US",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full`}
      >
        <QueryProvider>
          
         <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
                <Toaster />
        {children}
            </ThemeProvider>
          </QueryProvider>
      </body>
    </html>
  );
}
