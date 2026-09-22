import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import RegisterModal from "@/modals/RegisterModal";
import LoginModal from "@/modals/LoginModal";
import { Toaster } from "react-hot-toast";
import CreateListingModal from "@/modals/CreateListingModal";
import FilterModal from "@/modals/FilterModal";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
        className={`${poppins.className} min-h-screen bg-[#0a0a0b] text-white antialiased`}
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