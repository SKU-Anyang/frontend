// src/pages/UserCuration.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loadFavs, isFav, toggleFav } from "../utils/favorites";

/** API BASE */
const API_BASE = (import.meta.env.VITE_API_BASE ?? "http://3.36.114.249:8080").replace(/\/$/, "");

/** 익명 사용자 ID 확보 */
function getOrCreateAnonId() {
  let id = localStorage.getItem("anonId");
  if (!id) {
    id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    localStorage.setItem("anonId", id);
  }
  return id;
}

/** 문자열 응답(LLM) */
const ax = axios.create({
  baseURL: API_BASE,
  headers: { Accept: "*/*" },          // ← 스웨거가 string 응답
});

/** JSON 응답(북마크) */
const axJson = axios.create({
  baseURL: API_BASE,
  headers: { Accept: "application/json" },
  withCredentials: true,
});

/** 공통 인터셉터 */
for (const inst of [ax, axJson]) {
  inst.interceptors.request.use((config) => {
    config.headers["X-Anon-Id"] = getOrCreateAnonId();
    const token = localStorage.getItem("accessToken");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  });
}

/* ---------------- 파서 ---------------- */
function parseCuration(text) {
  if (!text || typeof text !== "string") return [];
  let src = String(text).trim();
  src = src.replace(/```[\s\S]*?```/g, (m) => m.replace(/```[a-zA-Z]*\n?|\n?```/g, "").trim());
  if ((src.startsWith('"') && src.endsWith('"')) || (src.startsWith("'") && src.endsWith("'"))) {
    try { const unq = JSON.parse(src); if (typeof unq === "string") src = unq.trim(); } catch {}
  }
  try {
    const data = JSON.parse(src);
    if (Array.isArray(data)) return normalizeJsonArray(data);
    if (data && typeof data === "object" && (data.title || data.points || data.subtitle)) {
      return normalizeJsonArray([data]);
    }
  } catch {}
  const arr = src.match(/\[[\s\S]*\]/);
  if (arr) { try { const data = JSON.parse(arr[0]); if (Array.isArray(data)) return normalizeJsonArray(data); } catch {} }
  const obj = src.match(/\{[\s\S]*\}/);
  if (obj) { try { const data = JSON.parse(obj[0]); return Array.isArray(data) ? normalizeJsonArray(data) : normalizeJsonArray([data]); } catch {} }

  // 텍스트/마크다운 대충 파싱
  const lines = src.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  const items = [];
  let block = [];
  const push = () => { if (block.length) { items.push(block.join("\n")); block=[]; } };
  for (const ln of lines) { if (!ln) push(); else block.push(ln); } push();
  return items.map((b, i) => {
    const ls = b.split(/\r?\n/);
    const title = ls[0]?.replace(/^#+\s*/, "").replace(/^\d+[.)]\s*/, "") || "제목 없음";
    const points = ls.slice(1).map(s=>s.replace(/^[-*•]\s*/, "")).filter(Boolean);
    return { id: `rec-${i+1}`, title, subtitle: "", tags: [], confidence: 0, points };
  });
}
function normalizeJsonArray(data) {
  return data.map((r, i) => ({
    id: r.id || `rec-${i + 1}`,
    title: r.title || "제목 없음",
    subtitle: r.subtitle || r.subTitle || "",
    tags: Array.isArray(r.tags) ? r.tags : `${r.tags || ""}`.split(/[,\s]+/).filter(Boolean),
    confidence: typeof r.confidence === "number" ? r.confidence : 0,
    points: Array.isArray(r.points) ? r.points : r.bullets || r.lines || [],
  }));
}

/* -------- 북마크 → region / profile 생성 유틸 -------- */
const pickTop = (arr, n=2) =>
  [...arr.reduce((m,v)=>m.set(v,(m.get(v)||0)+1), new Map())]
    .sort((a,b)=>b[1]-a[1]).slice(0,n).map(([v])=>v);

function buildParamsFromBookmarks(list) {
  // region: 북마크에 region 필드가 있으면 최빈값, 없으면 기본 "서울"
  const regions = list.map(b => (b.region || "").trim()).filter(Boolean);
  const region = pickTop(regions,1)[0] || "서울";

  // profile: tags 최빈 2개 → 없으면 category 최빈 → 없으면 title/summary에서 키워드
  let pool = [];
  list.forEach(b => { if (Array.isArray(b.tags)) pool.push(...b.tags); });
  if (!pool.length) pool = list.map(b => b.category).filter(Boolean);
  if (!pool.length) {
    const dict = ["카페","디저트","브런치","바","술","루프탑","클래스","체험","포토","힙","감성","스터디","베이커리"];
    list.forEach(b => {
      const text = `${b.title||""} ${b.summary||""}`;
      dict.forEach(k => { if (text.includes(k)) pool.push(k); });
    });
  }
  const top2 = pickTop(pool,2);
  const profile = top2.join(",") || "일반";
  return { region, profile };
}

/* ---------------- 메인 ---------------- */
export default function UserCuration() {
  const navigate = useNavigate();
  const [favs, setFavs] = useState([]);     // 서버 북마크
  const [hiddenRecs, setHiddenRecs] = useState(()=>new Set());
  const [apiRecs, setApiRecs] = useState([]);
  const [curLoading, setCurLoading] = useState(false);
  const [curError, setCurError] = useState("");
  const [rawResp, setRawResp] = useState("");
  const scrollRef = useRef(null);

  /** 1) 서버 북마크 로드 */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axJson.get("/api/bookmarks");   // ← GET
        const list = Array.isArray(data) ? data : [];
        const mapped = list.map((b, i) => ({
          id: b.ideaId ?? b.id ?? `sv-${i + 1}`,
          title: b.title ?? "제목 없음",
          summary: b.summary || "",
          region: b.region || "",
          category: b.industry || "",
          tags: Array.isArray(b.tags) ? b.tags : [],
        }));
        setFavs(mapped);
      } catch (e) {
        console.warn("[BOOKMARKS] 서버 조회 실패 → 로컬 폴백:", e?.message || e);
        const loaded = loadFavs() || [];
        setFavs([...loaded]);
      }
    })();
  }, []);

  /** 2) 찜 기반 추천 호출: GET /api/ai/curation/from-bookmarks */
  useEffect(() => {
    if (!favs.length) { setApiRecs([]); setRawResp(""); setCurError(""); return; }
    const { region, profile } = buildParamsFromBookmarks(favs);
    const take = 5; // 스웨거 기본 예시값

    setCurLoading(true); setCurError(""); setRawResp("");
    console.log("[CURATION] params →", { region, profile, take });

    ax.get("/api/ai/curation/from-bookmarks", { params: { region, profile, take } })
      .then((res) => {
        const text = res.data ?? "";
        setRawResp(String(text).slice(0, 2000));
        const parsed = parseCuration(String(text));
        setApiRecs(Array.isArray(parsed) && parsed.length ? parsed : []);
      })
      .catch((err) => {
        console.error("[CURATION] error", err?.message, err);
        setApiRecs([]);
        setCurError(err?.response?.data || err?.message || "추천 불러오는 중 오류가 발생했어요.");
      })
      .finally(() => setCurLoading(false));
  }, [favs]);

  // 폴백: 태그 기반 로컬
  const baseRecs = useMemo(() => {
    const tagCount = new Map();
    favs.forEach((f)=> (f.tags||[]).forEach(t=> tagCount.set(t,(tagCount.get(t)||0)+1)));
    const top = [...tagCount.entries()].sort((a,b)=>b[1]-a[1]).slice(0,2).map(([t])=>t);
    if (top.length===0) return DEFAULT_RECS;
    const scored = DEFAULT_RECS
      .map(r => ({...r,_score:(r.tags||[]).reduce((s,t)=>s+(top.includes(t)?1:0),0)}))
      .sort((a,b)=> b._score - a._score || b.confidence - a.confidence);
    return scored.slice(0,4);
  }, [favs]);

  const recommendations = useMemo(() => {
    const src = apiRecs.length ? apiRecs : baseRecs;
    return src.filter(r => !hiddenRecs.has(r.id));
  }, [apiRecs, baseRecs, hiddenRecs]);

  const slide = (dir) => {
    const el = scrollRef.current; if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth - 120), behavior: "smooth" });
  };

  const onToggleRecFav = (rec) => {
    toggleFav({ id: rec.id, title: rec.title, region: "추천", category: rec.subtitle || "추천 아이템", tags: rec.tags || [] });
    console.log("[LOCAL FAV] toggled");
  };
  const onDeleteRec = (id) => setHiddenRecs(prev => new Set(prev).add(id));

  return (
    <section className="min-h-screen bg-[#F6F8FB]">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 space-y-10">
        {/* 상단: 서버 북마크 */}
        <div className="bg-white rounded-3xl border shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">사용자 아이디어 찜 목록</h2>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => slide(-1)} className="h-9 w-9 rounded-full border hover:bg-gray-50">‹</button>
              <button onClick={() => slide(1)}  className="h-9 w-9 rounded-full border hover:bg-gray-50">›</button>
            </div>
          </div>

          {favs.length === 0 ? (
            <div className="text-sm text-gray-500 py-8">아직 서버에 저장된 찜이 없습니다. 다른 페이지에서 ♥로 저장해 보세요.</div>
          ) : (
            <div className="relative">
              <div className="md:hidden mb-3 flex justify-end gap-2">
                <button onClick={() => slide(-1)} className="h-8 w-8 rounded-full border">‹</button>
                <button onClick={() => slide(1)}  className="h-8 w-8 rounded-full border">›</button>
              </div>
              <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                {favs.map((f) => (
                  <div key={f.id} className="min-w-[280px] max-w-[280px] snap-start">
                    <FavCard
                      item={f}
                      onView={() =>
                        navigate("/market-insights", {
                          state: { fromCuration: true, item: { id: f.id, title: f.title, region: f.region || "지역 미상", category: f.category || "업종 미상", tags: f.tags || [] } },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 하단: 추천 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">유사 창업 아이디어 추천</h3>
            {curLoading ? (
              <span className="text-xs px-2 py-1 rounded bg-gray-100">Loading…</span>
            ) : (
              <span className={`text-xs px-2 py-1 rounded ${apiRecs.length ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                {apiRecs.length ? "API" : "LOCAL"}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-4">찜한 항목에서 지역/키워드를 뽑아 추천해요.</p>

          {curError && <div className="text-sm text-red-600 mb-2">❌ {String(curError)}</div>}
          {rawResp && (
            <pre className="text-xs text-slate-700 bg-slate-50 border rounded p-2 mb-3 overflow-x-auto">{rawResp}</pre>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recommendations.map((rec) => (
              <RecCard key={rec.id} rec={rec} liked={isFav(rec.id)} onToggleLike={() => onToggleRecFav(rec)} onDelete={() => onDeleteRec(rec.id)} />
            ))}
            {recommendations.length === 0 && (
              <div className="text-sm text-gray-500 p-6 bg-white rounded-2xl border">표시할 추천이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 카드 ---------------- */
function FavCard({ item, onView }) {
  const hasMeta = item.region || item.category;
  return (
    <div className="h-full bg-white rounded-2xl border shadow-sm p-4 flex flex-col">
      <div className="text-[15px] font-semibold text-gray-900">{item.title}</div>
      {hasMeta ? (
        <div className="text-xs text-gray-500 mt-1">📍 {item.region || "지역 미상"} · {item.category || "업종 미상"}</div>
      ) : (
        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{item.summary || "설명 없음"}</div>
      )}
      <div className="mt-2 text-xs text-blue-700 line-clamp-1">
        {(item.tags || []).slice(0, 3).map((t) => `#${t}`).join(" ")}
      </div>
      <div className="mt-auto pt-3">
        <button onClick={onView} className="px-3 h-9 rounded-full bg-blue-600 text-white text-xs hover:bg-blue-700">
          시장성 분석 보기
        </button>
      </div>
    </div>
  );
}
function RecCard({ rec, liked, onToggleLike, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      <div className="text-[15px] font-semibold">{rec.title}</div>
      <div className="mt-1 text-xs text-blue-700">{rec.subtitle}</div>
      <ul className="mt-3 text-sm text-gray-800 space-y-1 list-disc pl-5">
        {(rec.points || []).map((p, i) => (<li key={i}>{p}</li>))}
      </ul>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-500">{(rec.tags || []).map((t) => (<span key={t} className="mr-2">#{t}</span>))}</div>
        <div className="flex items-center gap-2">
          <button onClick={onToggleLike} title="찜" className="h-9 w-9 grid place-items-center rounded-full border hover:bg-gray-50"><span className="text-[16px]">{liked ? "❤️" : "🤍"}</span></button>
          <button onClick={onDelete} title="삭제" className="h-9 w-9 grid place-items-center rounded-full border hover:bg-gray-50">🗑</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- 폴백 더미 ---------------- */
const DEFAULT_RECS = [
  { id: "rec-1", title: "복카페 + 작가의 방", subtitle: "특화공간형 감성 카페", tags: ["감성","MZ"], confidence: 0.9, points: ["작가/20대 타깃","북 큐레이션+포토존","소형 평수 최적화"] },
  { id: "rec-2", title: "루프탑 힐링 바", subtitle: "낮엔 스터디, 밤엔 칵테일", tags: ["야간수요","포토"], confidence: 0.85, points: ["낮/밤 복합 매출","유동인구 집중","SNS 확산 유리"] },
  { id: "rec-3", title: "감성 스튜디오 카페", subtitle: "낮 카페, 밤 촬영 대여", tags: ["감성","포토"], confidence: 0.82, points: ["Z세대 선호","대여로 비수기 완화","테이크아웃 회전"] },
  { id: "rec-4", title: "플라워 감성 DIY 카페", subtitle: "체험형 클래스 운영", tags: ["클래스","감성"], confidence: 0.8, points: ["재방문 유도","소품/키트 부가매출","SNS 확산 강점"] },
];
