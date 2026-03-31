import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/layout/NavBar";
import UserPicker from "@/components/layout/UserPicker";

export const metadata: Metadata = {
  title: "Space Rooms",
  description: "Real-time equipment & presence dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        <NavBar />
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-end mb-4">
            <UserPicker />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
