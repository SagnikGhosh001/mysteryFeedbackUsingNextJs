import { Geist, Geist_Mono } from "next/font/google";
// import "../globals.css"; // Adjust path since it's now deeper


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </div>
  );
}