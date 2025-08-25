// src/pages/IdeaResults.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import searchIcon2 from "../assets/search2.png";

/* ============================
   유틸
============================ */
function parseQuery(raw) {
  const s = (raw || "").trim();
  if (!s) return { region: "", category: "" };
  const parts = s.split(",").map((x) => x.trim()).filter(Boolean);
  if (parts.length === 1) return { region: parts[0], category: "" };
  return { region: parts[0], category: parts[1] || "" };
}

function pickTags({ regionHint, categoryHint }, topN = 4) {
  const scores = new Map([
    ["유동인구", 0], ["회전율", 0], ["단골화", 0], ["구독", 0],
    ["테이크아웃", 0], ["점심피크", 0], ["주거밀집", 0],
    ["역세권", 0], ["MVP", 0], ["팝업", 0], ["프리미엄", 0],
    ["예약제", 0], ["리뷰", 0], ["체험형", 0],
  ]);
  const catBoost = {
    카페: { 테이크아웃: 2, 회전율: 2, 리뷰: 1, 프리미엄: 1 },
    식당: { 점심피크: 2, 단골화: 1, 리뷰: 1 },
    학원: { 주거밀집: 2, 단골화: 1 },
    뷰티: { 단골화: 2, 프리미엄: 1, 예약제: 1 },
    펫:   { 체험형: 2, 단골화: 1, 리뷰: 1 },
  };
  const r = regionHint || "";
  const regionWords = [
    ["역", { 역세권: 2, 유동인구: 1, 테이크아웃: 1 }],
    ["정류장", { 유동인구: 2, 테이크아웃: 1 }],
    ["오피스", { 점심피크: 2, 회전율: 1 }],
    ["학원", { 주거밀집: 2, 점심피크: 1 }],
    ["주거", { 주거밀집: 2, 단골화: 1 }],
  ];
  for (const [kw, boost] of regionWords) {
    if (r.includes(kw)) for (const [t, w] of Object.entries(boost)) {
      scores.set(t, (scores.get(t) || 0) + w);
    }
  }
  const c = (categoryHint || "").trim();
  if (catBoost[c]) for (const [t, w] of Object.entries(catBoost[c])) {
    scores.set(t, (scores.get(t) || 0) + w);
  }
  for (const k of scores.keys()) scores.set(k, (scores.get(k) || 0) + 0.1);
  return [...scores.entries()].sort((a,b)=>b[1]-a[1]).slice(0, topN).map(([t])=>t);
}

/* ============================
   API (항상 문자열 반환 가정)
============================ */
const API_BASE = "http://3.36.114.249:8080";
const API_RECO_PATH = "/api/ai/idea";
const RADIUS_DEFAULT = 800;

async function requestRecommendations({ region, category, lat = 0, lng = 0 }) {
  const body = {
    lat, lng,
    region: region || "",
    interests: [category].filter(Boolean),
    radiusMeters: RADIUS_DEFAULT,
  };

  const res = await fetch(`${API_BASE}${API_RECO_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();           // ← 문자열 확정
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  return text;
}

/* ============================
   문자열 → 인트로 + 카드N 파싱 (인덱스 기반, 매우 관대)
============================ */
// 문자열 → 인트로 + 카드N 파싱 (굵은 번호(**1.)도 지원)
function parseRecommendText(raw, { region, category }) {
  // 공백/개행 정규화
  let text = String(raw)
    .replace(/\r/g, "\n")
    .replace(/\u00A0/g, " ")  // nbsp
    .replace(/\u3000/g, " ")  // 전각 공백
    .replace(/\t/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // ✅ 1) "**1." 또는 "** 1." 처럼 굵게 처리된 번호 마커를 일반 번호로 정규화
  //    예: "**1. 제목**" → "1. 제목**" (앞쪽 볼드 마커 제거)
  text = text.replace(/(^|\n)\s*\*\*\s*(\d+)([.)])\s+/g, "$1$2$3 ");

  // ✅ 2) 라인 시작의 들여쓰기 제거(번호가 앞에 오도록)
  const normalized = text
    .split("\n")
    .map(l => l.replace(/^\s+/, "")) // 라인 앞 공백 제거
    .join("\n");

  // 인트로(첫 번호 이전)
  const firstNum = normalized.match(/(^|\n)\s*\d+[.)]\s+/);
  const intro = firstNum ? normalized.slice(0, firstNum.index).trim() : "";

  // 번호 마커 인덱스 수집 (라인 시작이 아니어도 \n 뒤면 OK)
  const markerRe = /(^|\n)\s*(\d+)[.)]\s+/g;
  const markers = [];
  let m;
  while ((m = markerRe.exec(normalized)) !== null) {
    const start = m.index + (m[1] ? m[1].length : 0); // 숫자 시작 위치
    markers.push({ index: start, number: parseInt(m[2], 10) });
  }

  // 블록 단위로 잘라 카드 만들기
    // 블록 단위로 잘라 카드 만들기
    const cards = [];
    for (let i = 0; i < markers.length; i++) {
      const from = markers[i].index;
      const to = i + 1 < markers.length ? markers[i + 1].index : normalized.length;
  
      // 블록 내용(선행 "N. " 제거)
      let block = normalized.slice(from, to).replace(/^\s*\d+[.)]\s+/, "").trim();
      if (!block) continue;
  
      // --- 제목/본문 안전 분리 로직 ---
      // 1) 첫 non-empty 줄을 후보로
      const rawLines = block.split("\n");
      let firstIdx = 0;
      while (firstIdx < rawLines.length && !rawLines[firstIdx].trim()) firstIdx++;
  
      let titleRaw = rawLines[firstIdx]?.trim() || `추천 아이템 ${i + 1}`;
      let restLines = rawLines.slice(firstIdx + 1);
  
      // 2) 만약 첫 줄이 "**제목**..." 형식이면 굵게 제목과 나머지로 분리
      //    (예: "**범계 펫 동반 카페** 핵심가치: ..." → 제목/본문 분리)
      const boldMatch = titleRaw.match(/^\*\*(.+?)\*\*(.*)$/);
      if (boldMatch) {
        titleRaw = boldMatch[1].trim();                 // **제목** 안쪽
        const tail = boldMatch[2].trim();               // ** 뒤에 이어지는 본문 조각
        if (tail) restLines = [tail, ...restLines];     // 본문 맨 앞에 붙여줌
      } else {
        // 3) 굵게가 아니어도 양끝 마크다운 기호/따옴표 제거
        //    (제목 끝에 남은 **, *, _, ` 등을 정리)
        titleRaw = titleRaw
          .replace(/^\*\*(.+?)\*\*$/, "$1")
          .replace(/^[_*`]+|[_*`]+$/g, "")
          .replace(/^\*+|\*+$/g, "")
          .replace(/^['"]|['"]$/g, "")
          .trim();
        // 혹시 제목 끝에 남아있는 닫힘 ** 한 쌍 제거
        titleRaw = titleRaw.replace(/\*\*+$/g, "").trim();
      }
  
      const title = titleRaw || `추천 아이템 ${i + 1}`;
      const markdown = restLines.join("\n").trim();
  
      cards.push({
        id: i + 1,
        title,
        markdown,
        tags: pickTags({ regionHint: region, categoryHint: category }, 4),
      });
    }
  

  if (!cards.length && normalized) {
    return {
      intro,
      cards: [{
        id: 1,
        title: `${region || "해당 지역"} ${category || "로컬"} 추천`,
        markdown: normalized,
        tags: pickTags({ regionHint: region, categoryHint: category }, 4),
      }],
    };
  }

  return { intro, cards };
}


/* ============================
   컴포넌트
============================ */
export default function IdeaResults() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("query") || "";
  }, [location.search]);

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [intro, setIntro] = useState("");
  const [cards, setCards] = useState([]);

  const { region, category } = useMemo(() => parseQuery(initialQuery), [initialQuery]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!initialQuery.trim()) {
        setCards([]);
        setIntro("");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const text = await requestRecommendations({ region, category });
        if (cancelled) return;
      
        // 🔍 디버깅용 로그
        console.log("[RAW]", text.slice(0, 400));
        console.log("[MARKERS]", [...text.matchAll(/(^|\n)\s*(\d+)\.\s+/g)].length);
      
        const parsed = parseRecommendText(text, { region, category });
        setIntro(parsed.intro);
        setCards(parsed.cards);
      
      } catch (e) {
        if (cancelled) return;
        setError(`서버 호출 실패: ${e.message}`);
        // 간단 폴백
        const reg = region || "해당 지역";
        const cat = category || "로컬";
        setIntro(`${reg} ${cat} 폴백 추천`);
        setCards([
          {
            id: 1,
            title: `${reg} '${cat}' 특화 마이크로 카페`,
            markdown: `- ${reg} 출퇴근/학원 라인 공략\n- 테이크아웃 중심으로 회전율 극대화`,
            tags: pickTags({ regionHint: region, categoryHint: category }, 4),
          },
          {
            id: 2,
            title: `${reg} 모바일 선주문·픽업 모델`,
            markdown: `- 대기 제거 → 점심 피크 수용력↑\n- 리뷰 유도, 빠른 회전`,
            tags: pickTags({ regionHint: region, categoryHint: category }, 4),
          },
        ]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [initialQuery, region, category]);

  const onSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/idea-results?query=${encodeURIComponent(q)}`);
  };

  const goInsight = (item) => {
    navigate(
      `/market-insights?region=${encodeURIComponent(region)}&category=${encodeURIComponent(category)}`,
      { state: { item } }
    );
  };

  // ReactMarkdown v9: 불필요 props를 DOM으로 넘기지 않도록 최소화
  const mdComponents = {
    p:    ({ children }) => <p style={{ margin: "0.25rem 0", lineHeight: 1.6 }}>{children}</p>,
    strong: ({ children }) => <strong>{children}</strong>,
    ul:   ({ children }) => <ul style={{ paddingLeft: 20, marginTop: 8 }}>{children}</ul>,
    ol:   ({ children }) => <ol style={{ paddingLeft: 20, marginTop: 8 }}>{children}</ol>,
    li:   ({ children }) => <li style={{ marginTop: 4 }}>{children}</li>,
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-r from-green-100 via-white to-blue-100">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 md:px-8 min-h-screen flex flex-col items-center pt-12 md:pt-16 pb-16">
        {/* 검색창 */}
        <form onSubmit={onSubmit} className="w-full max-w-3xl mb-8 md:mb-10">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='예) "범계, 카페" 또는 "범계"'
              className="w-full h-14 md:h-16 rounded-full border border-gray-200 bg-white/90 shadow-sm px-6 pr-24 text-base md:text-lg placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300"
            />
            <button
              type="submit"
              aria-label="검색"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-full bg-transparent"
            >
              <img src={searchIcon2} alt="검색 아이콘" className="h-5 w-5 md:h-6 md:w-6 object-contain select-none" draggable={false} />
            </button>
          </div>
        </form>

        {/* 현재 검색 키워드 */}
        <div className="w-full max-w-3xl mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">검색 결과</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {region && (<span className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-blue-200 bg-blue-50 text-blue-700">지역: {region}</span>)}
            {category && (<span className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-emerald-200 bg-emerald-50 text-emerald-700">업종: {category}</span>)}
            {!region && !category && (<span className="text-gray-500">상단 입력창에 <b>“지역, 업종”</b>을 입력해 검색을 시작하세요.</span>)}
          </div>
        </div>

        {/* 결과 리스트 */}
        <div className="w-full max-w-3xl">
          {loading && (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white/70 border border-gray-200 p-4" />
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4 text-yellow-800 mb-4">
              {error}
            </div>
          )}

          {!loading && cards.length === 0 && initialQuery && (
            <div className="rounded-xl bg-white/80 border border-gray-200 p-6 text-gray-500">
              관련 결과가 없어요. 검색어를 바꿔보세요.
            </div>
          )}

          {!loading && cards.length > 0 && (
            <ul className="space-y-4">
              {!!intro && (
                <li className="rounded-2xl bg-white border border-blue-300/70 p-5 shadow-sm">
                  <ReactMarkdown components={mdComponents}>{intro}</ReactMarkdown>
                </li>
              )}

              {cards.map((item) => (
                <li key={item.id} className="rounded-2xl bg-white border border-blue-300/70 p-5 shadow-sm flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">{item.title}</h3>

                    {!!item.markdown && (
                      <div className="mt-2">
                        <ReactMarkdown components={mdComponents}>
                          {item.markdown}
                        </ReactMarkdown>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {item.tags?.map((t, i) => (
                          <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-gray-200 bg-gray-50 text-gray-700">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            `/market-insights?region=${encodeURIComponent(region)}&category=${encodeURIComponent(category)}`,
                            { state: { item } }
                          )
                        }
                        className="shrink-0 inline-flex items-center justify-center px-4 h-10 rounded-full bg-blue-600 text-white text-sm md:text-base hover:bg-blue-700 transition"
                      >
                        시장성 분석 보기
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!loading && !initialQuery && (
            <div className="rounded-xl bg-white/80 border border-gray-200 p-6 text-gray-500">
              상단 입력창에 <b>“지역, 업종”</b>을 입력해 검색을 시작하세요.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
