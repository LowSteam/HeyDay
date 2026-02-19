import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";

export const metadata: Metadata = {
  title: "Heyday Food Court",
  description:
    "Discover 5 amazing restaurants under one roof. Ask our AI food guide anything!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-amber-950 text-amber-200 text-center py-6 text-sm">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-amber-400">Heyday Food Court</span> — Five
            restaurants, one incredible place.
          </p>
        </footer>
        <ChatBot />
      </body>
    </html>
  );
}
