import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = "https://yoonjaekoo-edu.github.io/knode/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "KNODE - 위키백과 링크 게임",
  description: "서로 관련 없어 보이는 두 위키백과 문서 사이의 길을 찾아보세요. 검색 없이 문서 속 링크만 따라 목표 문서에 도달하는 Wikipedia 탐색 게임입니다.",
  keywords: ["KNODE", "위키백과 게임", "위키피디아 게임", "Wikipedia game", "링크 게임", "지식 게임", "위키백과"],
  alternates: { canonical: siteUrl },
  verification: {
    google: "RxL19JoABRaSqv2sfjqa3FJrLKcAs7lOwGowK7zxVHo",
  },
  openGraph: {
    title: "KNODE - 위키백과 링크 게임",
    description: "검색 없이 문서 속 링크만 따라 서로 관련 없어 보이는 두 위키백과 문서를 연결하세요.",
    url: siteUrl,
    siteName: "KNODE",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "KNODE - 위키백과 링크 게임",
    description: "두 위키백과 문서 사이의 길을 링크만 따라 찾아가는 게임.",
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
