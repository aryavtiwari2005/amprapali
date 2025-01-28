import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { inter, montserrat, roboto, playfair, merriweather, poppins, dm_sans } from "@/utils/fonts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Amrapali Project",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}
        ${inter.variable} 
        ${playfair.variable} 
        ${roboto.variable} 
        ${montserrat.variable}
        ${merriweather.variable}
        ${poppins.variable}
        ${dm_sans.variable}
        antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
