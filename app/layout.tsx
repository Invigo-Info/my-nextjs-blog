import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlogHub - Discover Amazing Stories & Ideas",
  description: "Explore our collection of insightful articles, tutorials, and stories from industry experts and passionate writers. Join our community of creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
