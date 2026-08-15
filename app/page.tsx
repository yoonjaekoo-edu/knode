"use client";

import { FormEvent, MouseEvent, useEffect, useMemo, useState } from "react";
import { getRandomPair } from "./randomPages";

type WikiPage = { title: string; displayTitle: string; html: string };
type Step = { title: string };
type WikiApiResponse = { parse?: { title: string; displaytitle: string; text: { "*": string } }; error?: unknown };

const examples = [["비둘기", "C++"], ["김치", "블랙홀"], ["마인크래프트", "미적분학"]];
const normalize = (v: string) => v.replaceAll("_", " ").trim().toLocaleLowerCase("ko-KR");

async function fetchWiki(title: string): Promise<WikiPage> {
  const params = new URLSearchParams({ action:"parse", page:title, prop:"text|displaytitle", redirects:"1", format:"json", origin:"*" });
  const response = await fetch(`https://ko.wikipedia.org/w/api.php?${params.toString()}`);
  const data = (await response.json()) as WikiApiResponse;
  if (!response.ok || data.error || !data.parse) throw new Error("위키백과 문서를 찾을 수 없습니다.");
  return { title:data.parse.title, displayTitle:data.parse.displaytitle, html:data.parse.text["*"] };
}

export default function Home() {
  const initialPair = useMemo(() => getRandomPair(), []);
  const [start,setStart]=useState<string>(initialPair.start), [target,setTarget]=useState<string>(initialPair.target), [goal,setGoal]=useState<string>("");
  const [page,setPage]=useState<WikiPage|null>(null), [path,setPath]=useState<Step[]>([]);
  const [startedAt,setStartedAt]=useState(0), [seconds,setSeconds]=useState(0);
  const [loading,setLoading]=useState(false), [error,setError]=useState(""), [won,setWon]=useState(false);
  const moves=Math.max(0,path.length-1);
  const time=useMemo(()=>`${Math.floor(seconds/60).toString().padStart(2,"0")}:${(seconds%60).toString().padStart(2,"0")}`,[seconds]);

  useEffect(()=>{ if(!startedAt||won)return; const tick=()=>setSeconds(Math.floor((Date.now()-startedAt)/1000)); tick(); const id=window.setInterval(tick,1000); return()=>window.clearInterval(id); },[startedAt,won]);

  function randomize(){ const pair=getRandomPair(); setStart(pair.start); setTarget(pair.target); setError(""); }

  async function loadArticle(title:string){
    setLoading(true); setError("");
    try{ const data=await fetchWiki(title); setPage(data); setPath(old=>[...old,{title:data.title}]); window.scrollTo({top:0,behavior:"smooth"}); if(goal&&normalize(data.title)===normalize(goal))setWon(true); }
    catch(e){setError(e instanceof Error?e.message:"오류가 발생했습니다.");} finally{setLoading(false);}
  }

  async function begin(e?:FormEvent){
    e?.preventDefault(); if(!start.trim()||!target.trim())return; setError("");setWon(false);setPage(null);setPath([]);setSeconds(0);setLoading(true);
    try{ const [sd,td]=await Promise.all([fetchWiki(start.trim()),fetchWiki(target.trim())]); setGoal(td.title);setTarget(td.title);setStart(sd.title);setPage(sd);setPath([{title:sd.title}]);setStartedAt(Date.now());if(normalize(sd.title)===normalize(td.title))setWon(true); }
    catch(e){setError(e instanceof Error?e.message:"게임을 시작하지 못했습니다.");}finally{setLoading(false);}
  }

  async function handleArticleClick(e:MouseEvent<HTMLDivElement>){
    const a=(e.target as HTMLElement).closest("a") as HTMLAnchorElement|null;if(!a)return;e.preventDefault();
    const href=a.getAttribute("href")||""; let raw="";
    if(href.startsWith("/wiki/")) raw=href.slice(6); else if(href.startsWith("./")) raw=href.slice(2); else return;
    raw=raw.split("#")[0]; if(!raw||raw.includes(":"))return;
    try{const title=decodeURIComponent(raw).replaceAll("_"," ");if(!loading&&!won)await loadArticle(title);}catch{setError("이 링크를 열 수 없습니다.");}
  }

  if(!page)return <main className="landing"><nav className="nav"><div className="brand"><span className="brandMark">K</span>NODE</div><span className="navTag">WIKIPEDIA PATH GAME</span></nav><section className="hero"><div className="eyebrow">KNOWLEDGE IS A GRAPH.</div><h1>두 단어 사이의<br/><em>길</em>을 찾으세요.</h1><p className="lead">검색 없이, 오직 문서 안의 링크만 따라가세요.<br/>전혀 상관없어 보이는 두 지점도 결국 연결되어 있습니다.</p><form className="routeCard" onSubmit={begin}><div className="routeField"><label>START NODE</label><input value={start} onChange={e=>setStart(e.target.value)} placeholder="출발 문서"/></div><div className="routeArrow">→</div><div className="routeField"><label>TARGET NODE</label><input value={target} onChange={e=>setTarget(e.target.value)} placeholder="목표 문서"/></div><button disabled={loading}>{loading?"LOADING":"BEGIN"}</button></form>{error&&<div className="error">{error}</div>}<div className="examples"><span>TRY</span>{examples.map(([a,b])=><button key={a+b} onClick={()=>{setStart(a);setTarget(b)}}>{a} → {b}</button>)}<button className="randomButton" type="button" onClick={randomize}>↻ RANDOM PATH</button></div></section><footer><span>KNODE / 001</span><span>FIND THE PATH.</span></footer></main>;

  return <main className="game"><header className="gameHeader"><button className="logoButton" onClick={()=>{setPage(null);setWon(false)}}><span>K</span>NODE</button><div className="goal"><small>TARGET</small><strong>{goal}</strong></div><div className="stats"><div><small>MOVES</small><strong>{moves.toString().padStart(2,"0")}</strong></div><div><small>TIME</small><strong>{time}</strong></div></div></header><div className="pathBar"><span>PATH</span><div>{path.map((x,i)=><span className="crumb" key={`${x.title}-${i}`}>{i>0&&<b>→</b>}{x.title}</span>)}</div></div>{error&&<div className="gameError">{error}</div>}<article className={`articleShell ${loading?"isLoading":""}`}><div className="nodeMeta"><span>NODE {path.length.toString().padStart(3,"0")}</span><span>KO.WIKIPEDIA.ORG</span></div><h1 dangerouslySetInnerHTML={{__html:page.displayTitle}}/><div className="rule">CLICK A LINK TO MOVE TO THE NEXT NODE</div><div className="wikiArticle" onClick={handleArticleClick} dangerouslySetInnerHTML={{__html:page.html}}/></article>{won&&<div className="winBackdrop"><section className="winCard"><span className="winLabel">PATH COMPLETE</span><h2>{path[0]?.title}<br/><i>→</i> {goal}</h2><div className="winStats"><div><small>MOVES</small><strong>{moves}</strong></div><div><small>TIME</small><strong>{time}</strong></div></div><div className="finalPath">{path.map((x,i)=><span key={i}>{i>0&&" → "}{x.title}</span>)}</div><button onClick={()=>{setPage(null);setWon(false)}}>NEW PATH</button></section></div>}</main>;
}
