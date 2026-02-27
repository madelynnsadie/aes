import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";


const poppinsMono = Poppins({
  variable: "--poppins",
  weight: "400",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "aes",
  description: "track your money easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppinsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
