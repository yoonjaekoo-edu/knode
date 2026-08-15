import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KNODE — Find the path",
  description: "Travel from one Wikipedia article to another using only the links you find along the way.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
