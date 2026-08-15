"use client";

import { FormEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react";

type WikiPage = { title: string; displayTitle: string; html: string };
type Step = { title: string };

const examples = [
  ["비둘기", "C++"],
  ["김치", "블랙홀"],
  ["마인크래프트", "미적분학"],
];

function normalize(value: string) {
  return value.replaceAll("_", " ").trim().toLocaleLowerCase("ko-KR");
}

export default function Home() {
  const [start, setStart] = useState("비둘기");
  const [target, setTarget] = useState("C++");
  const [goal, setGoal] = useState("");
  const [page, setPage] = useState<WikiPage | null>(null);
  const [path, setPath] = useState<Step[]>([]);
  const [startedAt, setStartedAt] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [won, setWon] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  const moves = Math.max(0, path.length - 1);
  const time = useMemo(() => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [seconds]);

  useEffect(() => {
    if (!startedAt || won) return;
    const tick = () => setSeconds(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [startedAt, won]);

  async function loadArticle(title: string, append = true) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/wiki?title=${encodeURIComponent(title)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "문서를 불러오지 못했습니다.");
      setPage(data);
      if (append) setPath((old) => [...old, { title: data.title }]);
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (goal && normalize(data.title) === normalize(goal)) setWon(true);
      return data as WikiPage;
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function begin(e?: FormEvent) {
    e?.preventDefault();
    if (!start.trim() || !target.trim()) return;
    setError("");
    setWon(false);
    setPage(null);
    setPath([]);
    setSeconds(0);
    setGoal(target.trim());
    setLoading(true);

    try {
      const [startRes, targetRes] = await Promise.all([
        fetch(`/api/wiki?title=${encodeURIComponent(start.trim())}`),
        fetch(`/api/wiki?title=${encodeURIComponent(target.trim())}`),
      ]);
      const startData = await startRes.json();
      const targetData = await targetRes.json();
      if (!startRes.ok) throw new Error(`출발 문서 '${start}'를 찾을 수 없습니다.`);
      if (!targetRes.ok) throw new Error(`목표 문서 '${target}'를 찾을 수 없습니다.`);

      setGoal(targetData.title);
      setTarget(targetData.title);
      setStart(startData.title);
      setPage(startData);
      setPath([{ title: startData.title }]);
      setStartedAt(Date.now());
      if (normalize(startData.title) === normalize(targetData.title)) setWon(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "게임을 시작하지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleArticleClick(e: MouseEvent<HTMLDivElement>) {
    const anchor = (e.target as HTMLElement).closest("a") as HTMLAnchorElement | null;
    if (!anchor) return;
    e.preventDefault();

    const href = anchor.getAttribute("href") || "";
    if (!href.startsWith("/wiki/") || href.includes(":")) return;
    const raw = href.slice(6).split("#")[0];
    if (!raw) return;
    const title = decodeURIComponent(raw).replaceAll("_", " ");
    if (!loading && !won) await loadArticle(title);
  }

  if (!page) {
    return (
      <main className="landing">
        <nav className="nav"><div className="brand"><span className="brandMark">K</span>NODE</div><span className="navTag">WIKIPEDIA PATH GAME</span></nav>
        <section className="hero">
          <div className="eyebrow">KNOWLEDGE IS A GRAPH.</div>
          <h1>두 단어 사이의<br/><em>길</em>을 찾으세요.</h1>
          <p className="lead">검색 없이, 오직 문서 안의 링크만 따라가세요.<br/>전혀 상관없어 보이는 두 지점도 결국 연결되어 있습니다.</p>
          <form className="routeCard" onSubmit={begin}>
            <div className="routeField"><label>START NODE</label><input value={start} onChange={(e) => setStart(e.target.value)} placeholder="출발 문서" /></div>
            <div className="routeArrow">→</div>
            <div className="routeField"><label>TARGET NODE</label><input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="목표 문서" /></div>
            <button disabled={loading}>{loading ? "LOADING" : "BEGIN"}</button>
          </form>
          {error && <div className="error">{error}</div>}
          <div className="examples"><span>TRY</span>{examples.map(([a,b]) => <button key={a+b} onClick={() => { setStart(a); setTarget(b); }}>{a} → {b}</button>)}</div>
        </section>
        <footer><span>KNODE / 001</span><span>FIND THE PATH.</span></footer>
      </main>
    );
  }

  return (
    <main className="game">
      <header className="gameHeader">
        <button className="logoButton" onClick={() => { setPage(null); setWon(false); }}><span>K</span>NODE</button>
        <div className="goal"><small>TARGET</small><strong>{goal}</strong></div>
        <div className="stats"><div><small>MOVES</small><strong>{moves.toString().padStart(2,"0")}</strong></div><div><small>TIME</small><strong>{time}</strong></div></div>
      </header>
      <div className="pathBar"><span>PATH</span><div>{path.map((step, i) => <span className="crumb" key={`${step.title}-${i}`}>{i > 0 && <b>→</b>}{step.title}</span>)}</div></div>
      {error && <div className="gameError">{error}</div>}
      <article className={`articleShell ${loading ? "isLoading" : ""}`}>
        <div className="nodeMeta"><span>NODE {path.length.toString().padStart(3,"0")}</span><span>KO.WIKIPEDIA.ORG</span></div>
        <h1 dangerouslySetInnerHTML={{ __html: page.displayTitle }} />
        <div className="rule">CLICK A LINK TO MOVE TO THE NEXT NODE</div>
        <div ref={articleRef} className="wikiArticle" onClick={handleArticleClick} dangerouslySetInnerHTML={{ __html: page.html }} />
      </article>
      {won && <div className="winBackdrop"><section className="winCard"><span className="winLabel">PATH COMPLETE</span><h2>{path[0]?.title}<br/><i>→</i> {goal}</h2><div className="winStats"><div><small>MOVES</small><strong>{moves}</strong></div><div><small>TIME</small><strong>{time}</strong></div></div><div className="finalPath">{path.map((x,i)=><span key={i}>{i>0 && " → "}{x.title}</span>)}</div><button onClick={() => { setPage(null); setWon(false); }}>NEW PATH</button></section></div>}
    </main>
  );
}
