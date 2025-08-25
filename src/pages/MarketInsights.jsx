// src/pages/MarketInsights.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, LabelList,
} from "recharts";

/* -------------------- 공통 -------------------- */
const API_BASE = (import.meta.env.VITE_API_BASE || "http://3.36.114.249:8080").replace(/\/$/, "");

/* Kakao SDK 로더 (지오코딩/리버스지오코딩) */
function loadKakaoSdk(appKey) {
  return new Promise((resolve, reject) => {
    if (!appKey) return reject(new Error("VITE_KAKAO_MAP_KEY가 없습니다 (.env 확인)"));
    if (window.kakao?.maps) return resolve(window.kakao);
    const url = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
    const s = document.createElement("script");
    s.src = url;
    s.async = true;
    s.onload = () => {
      try {
        window.kakao.maps.load(() => resolve(window.kakao));
      } catch {
        reject(new Error("kakao.maps.load 실패 — JS키/도메인/제품 활성화 확인"));
      }
    };
    s.onerror = () => reject(new Error(`Kakao SDK load failed: ${url}`));
    document.head.appendChild(s);
  });
}

/* URL 쿼리 유틸 */
function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

/* 날짜 유틸 */
const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);
const yyyymmFrom = (d) => `${d.getFullYear()}${pad2(d.getMonth() + 1)}`;
const yyyy_mm_dd = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const DEFAULT_YMD8 = (() => {
  const d = new Date();
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;
})();

/* 파이 라벨(퍼센트) 안전 배치 */
const RAD = Math.PI / 180;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
function renderPieLabelClamp(args) {
  const { cx, cy, midAngle, innerRadius = 0, outerRadius, percent } = args || {};
  if (![cx, cy, midAngle, outerRadius].every((v) => typeof v === "number" && isFinite(v))) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.66;
  const x = cx + r * Math.cos(-midAngle * RAD);
  const y = cy + r * Math.sin(-midAngle * RAD);
  const pad = 8;
  const safeX = clamp(x, pad, cx * 2 - pad);
  return (
    <text x={safeX} y={y} fill="#111827" textAnchor="middle" dominantBaseline="central" fontSize="12">
      {(percent * 100).toFixed(0)}%
    </text>
  );
}

/* 색상 */
const PIE_COLORS = ["#7AA2FF", "#4B74FF", "#99C7FF", "#C7D8FF", "#9CA3AF"];
const DONUT_KEEP_COLOR = "#22c55e";
const DONUT_CLOSE_COLOR = "#EABF76";
const PRIMARY_BAR = "#4B74FF";

/* 도넛 폐업률(서버에 보낼 값) */
const BOOKMARK_CLOSE_RATE = 18;

/* -------------------- 페이지 -------------------- */
export default function MarketInsights() {
  const q = useQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const kakaoKey = import.meta.env.VITE_KAKAO_MAP_KEY;

  // 결과 카드에서 넘긴 데이터(최우선)
  const itemFromState = location.state?.item || null;

  const region = q.get("region") || itemFromState?.region || "범계";
  const category = q.get("category") || itemFromState?.category || "카페";
  const itemName = itemFromState?.title || q.get("item") || `${region} ${category} 아이템`;
  const rawTags = itemFromState?.tags || ["범계 카페", "나만의 시간", "힙 스폿"];
  const tags = typeof rawTags[0] === "string" ? rawTags : rawTags.map((t) => t?.name).filter(Boolean);
  const ideaIdFromState = Number(itemFromState?.id ?? q.get("ideaId")) || 0;

  /* 좌표: 쿼리로 들어오면 우선 사용 */
  const queryLat = parseFloat(q.get("lat"));
  const queryLng = parseFloat(q.get("lng"));

  /* ---------- 차트 데이터 상태 (초기 더미) ---------- */
  // 라인: 유동 인구
  const [flowLine, setFlowLine] = useState([
    { time: "06-09", 전체: 1200, 남성: 700, 여성: 500, 타겟층: 400 },
    { time: "09-12", 전체: 2200, 남성: 1300, 여성: 900, 타겟층: 800 },
    { time: "12-15", 전체: 3400, 남성: 1900, 여성: 1500, 타겟층: 1200 },
    { time: "15-18", 전체: 5000, 남성: 2900, 여성: 2100, 타겟층: 1700 },
    { time: "18-21", 전체: 5600, 남성: 3200, 여성: 2400, 타겟층: 2100 },
    { time: "21-24", 전체: 3600, 남성: 2000, 여성: 1600, 타겟층: 900 },
  ]);

  // 바: 유사 업종 수
  const [compBars, setCompBars] = useState([
    { name: "감성 카페", 값: 120 },
    { name: "디저트 카페", 값: 85 },
    { name: "브런치 카페", 값: 60 },
    { name: "테마 카페", 값: 40 },
  ]);

  // 파이: 연령대 비율
  const [agePie, setAgePie] = useState([
    { name: "10대", value: 9.8 },
    { name: "20대", value: 26.7 },
    { name: "30대", value: 33.3 },
    { name: "40대", value: 18.0 },
    { name: "50·60대", value: 12.2 },
  ]);

  // 찜 상태
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [bookmarkErr, setBookmarkErr] = useState("");

  // 상권 안정성 슬라이드: 0=도넛, 1=막대
  const [slideIdx, setSlideIdx] = useState(0);
  const prev = () => setSlideIdx((i) => (i - 1 + 2) % 2);
  const next = () => setSlideIdx((i) => (i + 1) % 2);

  /* ---------- 좌표 & admCd 얻기 → API 호출 ---------- */
  useEffect(() => {
    (async () => {
      let lat = Number.isFinite(queryLat) ? queryLat : undefined;
      let lng = Number.isFinite(queryLng) ? queryLng : undefined;

      try {
        const kakao = await loadKakaoSdk(kakaoKey);

        // 1) 키워드로 중심 좌표
        if (!(Number.isFinite(lat) && Number.isFinite(lng))) {
          const ps = new kakao.maps.services.Places();
          await new Promise((resolve) => {
            ps.keywordSearch(region, (data, status) => {
              if (status === kakao.maps.services.Status.OK && data?.length) {
                const { y, x } = data[0];
                lat = parseFloat(y);
                lng = parseFloat(x);
              }
              resolve();
            });
          });
        }
      } catch (e) {
        console.warn("[INSIGHTS] Kakao 로딩/지오코딩 실패:", e?.message || e);
      }

      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        void fetchAll({ lat, lng });
      } else {
        console.warn("[INSIGHTS] 좌표 없음 — 더미 데이터 표시");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  /* ---------- API 호출 묶음 ---------- */
  async function fetchAll({ lat, lng }) {
    try {
      /* 1) 연령대 비율: 최근 12개월 역탐색 */
      let agePicked = null;
      for (let i = 0; i < 12; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const yyyymm = yyyymmFrom(d);
        try {
          const res = await axios.get(`${API_BASE}/api/insights/age-share`, {
            params: { yyyymm, lat, lng },
          });
          const rows = Array.isArray(res.data) ? res.data : [];
          if (rows.length) { agePicked = rows; break; }
        } catch {}
      }
      if (agePicked) {
        const toAgeName = (bucket) => {
          const s = String(bucket ?? "");
          if (s.includes("50") && s.includes("60")) return "50·60대";
          if (/^\d{2}$/.test(s)) return `${s}대`;
          if (s === "teen" || s === "10s") return "10대";
          if (s === "twenties" || s === "20s") return "20대";
          if (s === "thirties" || s === "30s") return "30대";
          if (s === "forties" || s === "40s") return "40대";
          return s || "기타";
        };
        const parsed = agePicked
          .map((r) => ({
            name: toAgeName(r.bucket),
            value: typeof r.ratio === "number" ? Math.round(r.ratio * 1000) / 10 : 0,
          }))
          .filter((x) => x.value > 0)
          .sort((a, b) => {
            const ai = parseInt(a.name, 10);
            const bi = parseInt(b.name, 10);
            return (isNaN(ai) ? 99 : ai) - (isNaN(bi) ? 99 : bi);
          });
        if (parsed.length) setAgePie(parsed);
      }

      /* 2) 유사 업종 수 */
      const compRes = await axios.get(`${API_BASE}/api/insights/competitors`, {
        params: { lat, lng, radius: 800 },
      });
      const byCat = compRes?.data?.byCategory || {};
      const bars = Object.entries(byCat)
        .map(([name, v]) => ({ name, 값: Number(v) || 0 }))
        .filter((x) => x.값 > 0)
        .sort((a, b) => b.값 - a.값)
        .slice(0, 8);
      if (bars.length) setCompBars(bars);

      /* 3) 유동 인구 흐름: 최근 14일 역탐색 */
      let flowPicked = null;
      let ymd8 = DEFAULT_YMD8;
      for (let i = 0; i < 14; i++) {
        // yyyy-mm-dd 로 바꿔서 요청
        const date = `${ymd8.slice(0,4)}-${ymd8.slice(4,6)}-${ymd8.slice(6,8)}`;
        try {
          const res = await axios.get(`${API_BASE}/api/insights/living-pop`, {
            params: { date, lat, lng },
          });
          const rows = Array.isArray(res.data) ? res.data : [];
          if (rows.length) { flowPicked = rows; break; }
        } catch {}
        // 하루 롤백
        const d = new Date(Number(ymd8.slice(0,4)), Number(ymd8.slice(4,6)) - 1, Number(ymd8.slice(6,8)));
        d.setDate(d.getDate() - 1);
        ymd8 = `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;
      }
      if (flowPicked) {
        const line = flowPicked.map((r) => ({
          time: r.time || "",
          전체: Number(r.total) || 0,
          남성: Number(r.male) || 0,
          여성: Number(r.female) || 0,
          타겟층: Number(r.target) || 0,
        }));
        if (line.length) setFlowLine(line);
      }
    } catch (e) {
      console.warn("[INSIGHTS] API 오류 – 더미로 표시:", e?.message || e);
    }
  }

  /* ---------- 북마크 API ---------- */
  const handleBookmark = async () => {
    if (bookmarkLoading) return;
    setBookmarkLoading(true);
    setBookmarkErr("");
    try {
      const payload = {
        ideaId: ideaIdFromState,                          // number
        title: itemName,                                  // string
        summary: `지역: ${region} / 업종: ${category}`,    // string
        industry: category,                               // string
        region,                                           // string
        contentJson: JSON.stringify({
          region,
          category,
          tags,
          charts: { agePie, compBars, flowLine },
        }),                                               // string(JSON)
        closureYear: new Date().getFullYear(),           // number
        closureRate: BOOKMARK_CLOSE_RATE,                // number
      };

      const { data } = await axios.post(`${API_BASE}/api/bookmarks`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      // 기대 응답: { ideaId: number, created: boolean }
      if (data?.created === true) {
        setBookmarked(true);
      } else {
        setBookmarkErr("저장은 되었지만 응답 형식이 예상과 다릅니다.");
      }
    } catch (e) {
      setBookmarkErr(e?.response?.data?.message || e?.message || "북마크 저장 실패");
    } finally {
      setBookmarkLoading(false);
    }
  };

  /* ---------- UI ---------- */
  const summaryText =
    `2030 유동인구 밀집 지역인 ${region}에서 ${category}는 ` +
    `소비자 트렌드와 높은 일치도를 보이며, 인근 경쟁도도 낮아 시장성이 우수한 아이템입니다.`;

  return (
    <section className="min-h-screen bg-[#F6F8FB]">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
        {/* 헤더 */}
        <header className="bg-white rounded-3xl border border-gray-200/70 shadow-sm p-6 sm:p-8">
          <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-gray-900">
            {itemName}
          </h1>

          <div className="mt-1 text-gray-500">[ {category} · {region} ]</div>

          {/* 해시태그 + 찜 버튼 같은 줄 */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm bg-blue-50 text-blue-700 border border-blue-200">
                {category}
              </span>
              {tags?.map((t, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs sm:text-sm bg-gray-50 text-gray-700 border">
                  #{t}
                </span>
              ))}
            </div>

            <button
              onClick={handleBookmark}
              disabled={bookmarkLoading}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                bookmarked
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              title="즐겨찾기"
            >
              {bookmarked ? "♥ 저장됨" : bookmarkLoading ? "…저장중" : "♡ 찜"}
            </button>
          </div>

          {bookmarkErr && (
            <div className="mt-2 text-xs text-rose-600">{bookmarkErr}</div>
          )}

          {/* 요약 평가 */}
          <div className="mt-6 sm:mt-7">
            <div className="flex items-center gap-2 text-gray-800 font-semibold">
              <span role="img" aria-label="analysis">🧭</span>
              요약 평가
            </div>
            <p className="mt-2 text-[15px] leading-[1.9] text-gray-800">{summaryText}</p>
          </div>
        </header>

        {/* 라인 차트 (유동 인구) */}
        <section className="mt-8">
          <div className="bg-white rounded-[28px] border border-gray-200/70 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">유동 인구 흐름</h3>
                <p className="text-xs text-gray-400 mt-0.5">시간대별 전체/남성/여성/타겟층</p>
              </div>
              <span className="text-xs text-gray-500">단위: 명</span>
            </div>
            <div className="mt-3 sm:mt-4 h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={flowLine} margin={{ top: 28, right: 28, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, (dataMax) => Math.ceil((dataMax || 0) * 1.1)]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="전체" stroke="#9CA3AF" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="남성" stroke={PRIMARY_BAR} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="여성" stroke="#7AA2FF" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="타겟층" stroke="#99C7FF" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* 바 + 파이 2열 */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 바: 유사 업종 수 */}
          <div className="bg-white rounded-3xl border border-gray-200/70 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">유사 업종 수</h3>
              <span className="text-xs text-gray-500">{region} 인근</span>
            </div>
            <div className="mt-3 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compBars} margin={{ top: 24, right: 24, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tickMargin={6} />
                  <YAxis domain={[0, (dataMax) => Math.ceil((dataMax || 0) * 1.15)]} />
                  <Tooltip />
                  <Bar dataKey="값" fill={PRIMARY_BAR} radius={[6, 6, 0, 0]}>
                    <LabelList dataKey="값" position="top" offset={8} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 파이: 연령대 비율 */}
          <div className="bg-white rounded-3xl border border-gray-200/70 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">연령대 별 인구 비율</h3>
              <span className="text-xs text-gray-500">{region} 표본</span>
            </div>
            <div className="mt-3 h-56 overflow-visible">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={agePie}
                    dataKey="value"
                    nameKey="name"
                    cx="48%"
                    cy="50%"
                    outerRadius={85}
                    label={renderPieLabelClamp}
                    labelLine={false}
                  >
                    {agePie.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* 상권 안정성 (더미) */}
        <section className="mt-6">
          <div className="rounded-3xl border border-indigo-100 bg-indigo-50/60 p-4 sm:p-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/70 p-4 sm:p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">상권 안정성</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {slideIdx === 0 ? "유지율과 폐업률의 현재 비중을 보세요" : "폐업률 추이를 확인해 보세요"}
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {slideIdx === 0 ? "비율(%)" : "연도별 폐업률(%)"}
                </span>
              </div>

              <button
                onClick={prev}
                className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border bg-white items-center justify-center text-gray-700 hover:bg-gray-50"
                aria-label="prev"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border bg-white items-center justify-center text-gray-700 hover:bg-gray-50"
                aria-label="next"
              >
                ›
              </button>

              <div className="mt-3 sm:mt-4 h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  {slideIdx === 0 ? (
                    <PieChart>
                      <Pie
                        data={[
                          { name: "유지율", value: 82 },
                          { name: "폐업률", value: BOOKMARK_CLOSE_RATE },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={2}
                        label={(p) => (typeof p?.percent === "number" ? `${(p.percent * 100).toFixed(0)}%` : null)}
                        labelLine={false}
                      >
                        <Cell fill={DONUT_KEEP_COLOR} />
                        <Cell fill={DONUT_CLOSE_COLOR} />
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`} />
                    </PieChart>
                  ) : (
                    <BarChart
                      data={[
                        { year: "2020", closeRate: 18.5 },
                        { year: "2021", closeRate: 17.2 },
                        { year: "2022", closeRate: 16.1 },
                        { year: "2023", closeRate: 15.8 },
                        { year: "2024", closeRate: BOOKMARK_CLOSE_RATE },
                      ]}
                      margin={{ top: 28, right: 28, bottom: 0, left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" tickMargin={6} />
                      <YAxis domain={[0, (max) => Math.ceil((max + 2) * 1.05)]} tickFormatter={(v) => `${v}%`} />
                      <Tooltip formatter={(v) => `${v}%`} />
                      <Bar dataKey="closeRate" fill={DONUT_CLOSE_COLOR} radius={[8, 8, 0, 0]}>
                        <LabelList dataKey="closeRate" position="top" offset={10} formatter={(v) => v.toFixed(1)} />
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex items-center justify-center w-full">
                <div className="h-1.5 w-64 bg-gray-300 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gray-600 rounded-full transition-all"
                    style={{ width: slideIdx === 0 ? "50%" : "100%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="rounded-3xl bg-[#2F66F5] text-white p-5 sm:p-6 shadow-sm">
            <div className="text-sm opacity-90">🤖 분석 결과 코멘트</div>
            <p className="mt-1 leading-relaxed text-[15px]">
              이 아이디어는 {region} 인근에서 {category} 소비층을 겨냥한 경쟁력 있는 창업 아이템입니다.
              특히 SNS 확산 가능성과 차별화된 콘셉트가 강점입니다.
            </p>
          </div>
        </section>

       
      </div>
    </section>
  );
}
