import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Allen He | Full Stack Developer & AWS Solutions Architect",
  description:
    "Senior Full Stack Developer with 5+ years building scalable web applications, AI-enabled workflows, and fintech-focused products."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
