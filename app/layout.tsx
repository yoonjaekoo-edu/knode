import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = "https://yoonjaekoo-edu.github.io/knode/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "KNODE Path - 위키백과 링크 게임",
  description: "KNODE Path는 서로 관련 없어 보이는 두 위키백과 문서 사이의 길을 찾는 링크 탐색 게임입니다. 검색 없이 Wikipedia 문서 속 링크만 따라 목표 문서에 도달해 보세요.",
  keywords: ["KNODE Path", "KNODE 게임", "위키백과 링크 게임", "위키백과 게임", "위키피디아 게임", "Wikipedia path game", "Wikipedia game", "링크 게임", "지식 게임"],
  alternates: { canonical: siteUrl },
  verification: {
    google: "RxL19JoABRaSqv2sfjqa3FJrLKcAs7lOwGowK7zxVHo",
  },
  openGraph: {
    title: "KNODE Path - 위키백과 링크 게임",
    description: "검색 없이 링크만 따라 두 위키백과 문서 사이의 길을 찾아보세요.",
    url: siteUrl,
    siteName: "KNODE Path",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "KNODE Path - 위키백과 링크 게임",
    description: "검색 없이 링크만 따라 두 위키백과 문서 사이의 길을 찾는 게임.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
