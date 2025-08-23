import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import searchIcon2 from "../assets/search2.png";

/** "범계, 카페" → { region, category } */
function parseQuery(raw) {
  const s = (raw || "").trim();
  if (!s) return { region: "", category: "" };
  const parts = s.split(",").map((x) => x.trim()).filter(Boolean);
  if (parts.length === 1) return { region: parts[0], category: "" };
  return { region: parts[0], category: parts[1] || "" };
}

/** ── 해시태그 추천 로직 ─────────────────────────────
 * 지역/업종 키워드에 가중치를 줘서 점수 높은 태그를 상위 N개 추출
 * - 지역 힌트: 역/정류장/학원/오피스/주거 → 피크타임·회전율·단골화 등
 * - 업종 힌트: 카페/식당/학원/뷰티/펫 등 → 카테고리별 기본 태그 부여
 * 실제 API 붙이면 서버 점수만 쓰고, 이 함수는 제거해도 됨.
 */
function pickTags({ regionHint, categoryHint }, topN = 4) {
  // 기본 후보 풀(점수는 누적 가중치)
  const scores = new Map([
    ["유동인구", 0],
    ["회전율", 0],
    ["단골화", 0],
    ["구독", 0],
    ["테이크아웃", 0],
    ["점심피크", 0],
    ["주거밀집", 0],
    ["역세권", 0],
    ["MVP", 0],
    ["팝업", 0],
    ["프리미엄", 0],
    ["예약제", 0],
    ["리뷰", 0],
    ["체험형", 0],
  ]);

  // 업종별 기본 가중치
  const catBoost = {
    "카페": { 테이크아웃: 2, 회전율: 2, 리뷰: 1, 프리미엄: 1 },
    "식당": { 점심피크: 2, 단골화: 1, 리뷰: 1 },
    "학원": { 주거밀집: 2, 단골화: 1 },
    "뷰티": { 단골화: 2, 프리미엄: 1, 예약제: 1 },
    "펫": { 체험형: 2, 단골화: 1, 리뷰: 1 },
  };

  // 지역 키워드(간단 휴리스틱)
  const r = regionHint || "";
  const regionWords = [
    ["역", { 역세권: 2, 유동인구: 1, 테이크아웃: 1 }],
    ["정류장", { 유동인구: 2, 테이크아웃: 1 }],
    ["오피스", { 점심피크: 2, 회전율: 1 }],
    ["학원", { 주거밀집: 2, 점심피크: 1 }],
    ["주거", { 주거밀집: 2, 단골화: 1 }],
  ];
  for (const [kw, boost] of regionWords) {
    if (r.includes(kw)) {
      for (const [tag, w] of Object.entries(boost)) {
        scores.set(tag, (scores.get(tag) || 0) + w);
      }
    }
  }

  // 업종 가중치 부여
  const c = (categoryHint || "").trim();
  if (catBoost[c]) {
    for (const [tag, w] of Object.entries(catBoost[c])) {
      scores.set(tag, (scores.get(tag) || 0) + w);
    }
  }

  // 기본 보정(무조건 후보가 나오도록 살짝 가중)
  for (const k of scores.keys()) {
    scores.set(k, (scores.get(k) || 0) + 0.1);
  }

  // 점수 상위 N개 추출
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([tag]) => tag);
}

/** 더미 검색 (나중에 API로 교체) */
async function searchIdeas({ region, category }) {
  await new Promise((r) => setTimeout(r, 350));

  const tags = pickTags({ regionHint: region, categoryHint: category });
  const reg = region || "해당 지역";
  const cat = category || "로컬";

  const base = [
    {
      id: 1,
      title: `${reg} '${cat}' 특화 마이크로 카페`,
      subtitle: `${reg} 출퇴근/학원 라인 공략, 테이크아웃 중심으로 회전율 극대화`,
      bullets: [`${reg} 역/정류장 유동 인구 타깃 + 회전율 높은 운영 시스템`],
      tags,
    },
    {
      id: 2,
      title: `${reg} 모바일 선주문·픽업 모델`,
      subtitle: `대기 제거 → 점심 피크 수용력↑ · 리뷰 유도`,
      bullets: [`${reg} 오피스/학원 밀집 구간에 최적화`],
      tags: pickTags({ regionHint: region, categoryHint: category }, 4),
    },
    {
      id: 3,
      title: `${reg} 주말 팝업 ${cat}`,
      subtitle: `팝업으로 저비용 수요 검증 → 인근 공실 테스트베드`,
      bullets: [`주말 유동 집중 구간에서 MVP로 빠르게 검증`],
      tags: pickTags({ regionHint: region, categoryHint: category }, 4),
    },
  ];

  return base.sort(() => Math.random() - 0.5);
}

/*  실제 API 예시 (이 함수만 교체)
import axios from "axios";
async function searchIdeas({ region, category }) {
  const res = await axios.get("<<YOUR_API_ENDPOINT>>", { params: { region, category }});
  return res.data.items.map((it) => ({
    id: it.id,
    title: it.title,
    subtitle: it.summary,
    bullets: it.highlights,             // ["핵심 포인트", ...]
    tags: it.tags ?? [],                // ["해시태그", ...]
    insightUrl: it.insightUrl ?? null,  // 시장성 분석 링크 있으면 사용
  }));
}
*/

export default function IdeaResults() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("query") || "";
  }, [location.search]);

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const { region, category } = useMemo(
    () => parseQuery(initialQuery),
    [initialQuery]
  );

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!initialQuery.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const data = await searchIdeas({ region, category });
        if (!cancelled) setResults(data);
      } catch (e) {
        if (!cancelled) setError("결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => (cancelled = true);
  }, [initialQuery, region, category]);

  const onSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/idea-results?query=${encodeURIComponent(q)}`);
  };

  // “시장성 분석 보기” 클릭 시 이동할 경로 (필요시 라우터 맞춰 바꾸기)
  const goInsight = (item) => {
    const url = `/market-insights?region=${encodeURIComponent(region)}&category=${encodeURIComponent(category)}`;
    navigate(url);
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
              <img
                src={searchIcon2}
                alt="검색 아이콘"
                className="h-5 w-5 md:h-6 md:w-6 object-contain select-none"
                draggable={false}
              />
            </button>
          </div>
        </form>

        {/* 현재 검색 키워드 */}
        <div className="w-full max-w-3xl mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">검색 결과</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {region && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-blue-200 bg-blue-50 text-blue-700">
                지역: {region}
              </span>
            )}
            {category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-emerald-200 bg-emerald-50 text-emerald-700">
                업종: {category}
              </span>
            )}
            {!region && !category && (
              <span className="text-gray-500">
                상단 입력창에 <b>“지역, 업종”</b>을 입력해 검색을 시작하세요.
              </span>
            )}
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
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && results.length === 0 && initialQuery && (
            <div className="rounded-xl bg-white/80 border border-gray-200 p-6 text-gray-500">
              관련 결과가 없어요. 검색어를 바꿔보세요.
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <ul className="space-y-4">
              {results.map((item) => (
          <li
          key={item.id}
          className="rounded-2xl bg-white border border-blue-300/70 p-5 shadow-sm flex flex-col"
        >
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">{item.title}</h3>
            <p className="mt-1 text-blue-600">“{item.subtitle}”</p>
        
            {item.bullets?.map((b, idx) => (
              <div key={idx} className="mt-2 flex items-start gap-2 text-gray-700">
                <span className="select-none">✅</span>
                <span className="leading-relaxed">{b}</span>
              </div>
            ))}
        
            {/* 해시태그 + 버튼을 같은 flex 줄에 배치 */}
            <div className="mt-3 flex items-center justify-between">
              {/* 왼쪽 해시태그 */}
              <div className="flex flex-wrap gap-2">
                {item.tags?.map((t, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-gray-200 bg-gray-50 text-gray-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
        
              {/* 오른쪽 버튼 */}
             
            <button
                    onClick={() => navigate(
                        `/market-insights?region=${encodeURIComponent(region)}&category=${encodeURIComponent(category)}`,
                        { state: { item } }  // ← 여기! 아이템 통째로 전달
                    )}
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

          {!loading && !error && !initialQuery && (
            <div className="rounded-xl bg-white/80 border border-gray-200 p-6 text-gray-500">
              상단 입력창에 <b>“지역, 업종”</b>을 입력해 검색을 시작하세요.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
