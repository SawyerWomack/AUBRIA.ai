import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AUBRIA — Auburn University AI Keynote",
  description: "A student-built AI keynote speaker system from Auburn University",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
