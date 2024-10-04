import "./globals.css";

import type { Metadata } from "next";

import { Inter } from "@/fonts/fonts";

import { Providers } from "@/providers/provider";

export const metadata: Metadata = {
  title: "Next.js Typescript Boilerplate",
  description: "Next.JS Boilerplate with TypeScript and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={Inter.className}>   <Providers>{children}</Providers></body>
    </html>
  );
}
