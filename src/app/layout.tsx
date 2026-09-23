import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import RegisterModal from "@/modals/RegisterModal";
import LoginModal from "@/modals/LoginModal";
import { Toaster } from "react-hot-toast";
import CreateListingModal from "@/modals/CreateListingModal";
import FilterModal from "@/modals/FilterModal";
import localFont from "next/font/local";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const kiona = localFont({
  src: "../../public/fonts/Kiona-Regular.woff",
  variable: "--font-kiona",
  display: "swap",
});

const kionaItalic = localFont({
  src: "../../public/fonts/Kiona-Italic.woff",
  variable: "--font-kiona-italic",
  display: "swap",
});

const nouvelle = localFont({
  src: "../../public/fonts/nouvelle_vague.woff",
  variable: "--font-nouvelle",
  display: "swap",
});

const brilo = localFont({
  src: "../../public/fonts/Brilo.woff",
  variable: "--font-brilo",
  display: "swap",
});

const moonhouse = localFont({
  src: "../../public/fonts/Moonhouse.woff",
  variable: "--font-moonhouse",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cribting",
  description: "Short-Stay & Long-Stay Homes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#0a0a0b]">
      <body
        className={` ${poppins.variable} ${kiona.variable} ${kionaItalic.variable} ${moonhouse.variable} ${brilo.variable} ${nouvelle.variable} min-h-screen bg-[#0a0a0b] text-white antialiased`}
      >
        <Navbar />
        {children}
        <RegisterModal />
        <LoginModal />
        <Toaster />
        <CreateListingModal />
        <FilterModal />
      </body>
    </html>
  );
}