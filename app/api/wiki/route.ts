import { NextRequest, NextResponse } from "next/server";

const API = "https://ko.wikipedia.org/w/api.php";

export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get("title")?.trim();
  if (!title) {
    return NextResponse.json({ error: "문서 제목이 필요합니다." }, { status: 400 });
  }

  const params = new URLSearchParams({
    action: "parse",
    page: title,
    prop: "text|displaytitle",
    redirects: "1",
    format: "json",
  });

  try {
    const response = await fetch(`${API}?${params.toString()}`, {
      headers: { "User-Agent": "KNODE/0.1 (Wikipedia navigation game)" },
      next: { revalidate: 3600 },
    });
    const data = await response.json();

    if (!response.ok || data.error || !data.parse) {
      return NextResponse.json({ error: "위키백과 문서를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({
      title: data.parse.title,
      displayTitle: data.parse.displaytitle,
      html: data.parse.text["*"],
    });
  } catch {
    return NextResponse.json({ error: "위키백과에 연결하지 못했습니다." }, { status: 502 });
  }
}
