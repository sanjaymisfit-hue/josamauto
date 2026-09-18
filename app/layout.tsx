import type { Metadata } from "next";
import { Marcellus, Inter } from "next/font/google";
import "./globals.css";
import { dealer } from "@/lib/dealership";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(dealer.siteUrl),
  title: {
    default: "Josam Auto Company | Premium SUVs, Luxury & Performance Vehicles in Kenya",
    template: "%s | Josam Auto Company",
  },
  description: dealer.description,
  openGraph: {
    siteName: dealer.name,
    type: "website",
    images: [{ url: "/images/josam.webp", width: 1536, height: 1024, alt: "Josam Auto Company" }],
  },
};

import { CompareProvider } from "@/lib/compare-context";
import CompareFloatingBar from "@/components/compare-floating-bar";
import ChatBot from "@/components/chatbot";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${marcellus.variable} ${inter.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col bg-black">
        <CompareProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CompareFloatingBar />
          <ChatBot />
        </CompareProvider>
      </body>
    </html>
  );
}

