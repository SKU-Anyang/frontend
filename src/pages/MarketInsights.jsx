// src/pages/MarketInsights.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, LabelList,
} from "recharts";

/* URL 쿼리 유틸 */
function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

/* 파이 라벨(퍼센트) 안전 배치 */
const RAD = Math.PI / 180;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
function renderPieLabelClamp({ cx, cy, midAngle, innerRadius = 0, outerRadius, percent }) {
  const r = innerRadius + (outerRadius - innerRadius) * 0.66; // 조각 안쪽 66% 지점
  const x = cx + r * Math.cos(-midAngle * RAD);
  const y = cy + r * Math.sin(-midAngle * RAD);
  const pad = 8;
  const safeX = clamp(x, pad, (cx * 2) - pad);
  return (
    <text x={safeX} y={y} fill="#111827" textAnchor="middle" dominantBaseline="central" fontSize="12">
      {(percent * 100).toFixed(0)}%
    </text>
  );
}

const PIE_COLORS = ["#7AA2FF", "#4B74FF", "#99C7FF", "#C7D8FF", "#9CA3AF"];
const DONUT_KEEP_COLOR = "#22c55e"; // 유지율
const DONUT_CLOSE_COLOR = "#EABF76"; // 폐업률
const PRIMARY_BAR = "#4B74FF";

export default function MarketInsights() {
  const q = useQuery();
  const navigate = useNavigate();
  const location = useLocation();

  // 결과 카드에서 넘긴 데이터(최우선)
  const itemFromState = location.state?.item || null;

  const region = q.get("region") || itemFromState?.region || "범계역";
  const category = q.get("category") || itemFromState?.category || "카페";
  const itemName = itemFromState?.title || q.get("item") || `${region} ${category} 아이템`;
  const rawTags = itemFromState?.tags || ["범계 카페", "나만의 시간", "힙 스폿"];
  const tags = typeof rawTags[0] === "string" ? rawTags : rawTags.map(t => t?.name).filter(Boolean);

  /* 더미 데이터 (API 붙이면 교체) */
  const summaryText =
    `2030 유동인구 밀집 지역인 ${region}에서 감성 콘셉트 ${category}는 ` +
    `소비자 트렌드와 높은 일치도를 보이며, 인근 경쟁도도 낮아 시장성이 우수한 아이템입니다.`;

  // 라인: 타겟층 유동 흐름
  const lineData = [
    { name: "06-09", 직장인: 600, 학생: 220, 주부: 120, 전체: 1200 },
    { name: "09-12", 직장인: 1200, 학생: 280, 주부: 160, 전체: 2200 },
    { name: "12-15", 직장인: 1800, 학생: 320, 주부: 180, 전체: 3400 },
    { name: "15-18", 직장인: 2600, 학생: 300,  주부: 190, 전체: 5000 },
    { name: "18-21", 직장인: 3100, 학생: 250,  주부: 170, 전체: 5600 },
    { name: "21-24", 직장인: 2400, 학생: 180,  주부: 140, 전체: 3600 },
  ];

  // 바: 유사 업종 수
  const barData = [
    { name: "감성 카페", 값: 120 },
    { name: "디저트 카페", 값: 85 },
    { name: "브런치 카페", 값: 60 },
    { name: "테마 카페",  값: 40 },
  ];

  // 파이: 연령대 비율
  const pieData = [
    { name: "10대", value: 9.8 },
    { name: "20대", value: 26.7 },
    { name: "30대", value: 33.3 },
    { name: "40대", value: 18.0 },
    { name: "50·60대", value: 12.2 },
  ];

  // 상권 안정성 슬라이드: 0=도넛(유지율/폐업률 비중), 1=막대(연도별 폐업률 추이)
  const [slideIdx, setSlideIdx] = useState(0);
  const prev = () => setSlideIdx((i) => (i - 1 + 2) % 2);
  const next = () => setSlideIdx((i) => (i + 1) % 2);

  return (
    <section className="min-h-screen bg-[#F6F8FB]">
      {/* 상단 바 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-gray-900">
              ← 뒤로가기
            </button>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">시장성 분석</span>
          </div>
        </div>
      </div>

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
            <button className="rounded-full border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50" title="즐겨찾기">
              ♡
            </button>
          </div>

          {/* 요약 평가 */}
          <div className="mt-6 sm:mt-7">
            <div className="flex items-center gap-2 text-gray-800 font-semibold">
              <span role="img" aria-label="analysis">🧭</span>
              요약 평가
            </div>
            <p className="mt-2 text-[15px] leading-[1.9] text-gray-800">{summaryText}</p>
          </div>
        </header>

        {/* 라인 차트 */}
        <section className="mt-8">
          <div className="bg-white rounded-[28px] border border-gray-200/70 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">타겟층 중심 유동인구 흐름</h3>
                <p className="text-xs text-gray-400 mt-0.5">주 단위의 20분대 기준으로 그래프를 시각화했어요</p>
              </div>
              <span className="text-xs text-gray-500">단위: 명</span>
            </div>
            <div className="mt-3 sm:mt-4 h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 28, right: 28, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="전체" stroke="#9CA3AF" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="직장인" stroke={PRIMARY_BAR} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="학생" stroke="#7AA2FF" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="주부" stroke="#99C7FF" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* 바 + 파이 2열 */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 바 */}
          <div className="bg-white rounded-3xl border border-gray-200/70 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">유사 업종 수</h3>
              <span className="text-xs text-gray-500">{region} 인근</span>
            </div>
            <div className="mt-3 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 24, right: 24, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tickMargin={6} />
                  <YAxis domain={[0, (dataMax) => Math.ceil(dataMax * 1.15)]} />
                  <Tooltip />
                  <Bar dataKey="값" fill={PRIMARY_BAR} radius={[6, 6, 0, 0]}>
                    <LabelList dataKey="값" position="top" offset={8} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 파이 (라벨 잘림 방지: overflow-visible + custom label) */}
          <div className="bg-white rounded-3xl border border-gray-200/70 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">연령대 별 인구 비율</h3>
              <span className="text-xs text-gray-500">{region} 표본</span>
            </div>
            <div className="mt-3 h-56 overflow-visible">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="48%"          // 살짝 왼쪽 이동해 라벨 여유
                    cy="50%"
                    outerRadius={85}
                    label={renderPieLabelClamp}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* 상권 안정성: 유지율/폐업률 도넛 ↔ 연도별 폐업률 막대 슬라이드 */}
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

              {/* 좌우 화살표 */}
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
                    // (1) 현재 비중: 유지율 vs 폐업률 (도넛)
                    <PieChart>
                      <Pie
                        data={[
                          { name: "유지율", value: 82 },
                          { name: "폐업률", value: 18 },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={2}
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        <Cell fill={DONUT_KEEP_COLOR} />
                        <Cell fill={DONUT_CLOSE_COLOR} />
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`} />
                    </PieChart>
                  ) : (
                    // (2) 연도별 폐업률 추이: 막대 + 라벨
                    <BarChart
                      data={[
                        { year: "2020", closeRate: 18.5 },
                        { year: "2021", closeRate: 17.2 },
                        { year: "2022", closeRate: 16.1 },
                        { year: "2023", closeRate: 15.8 },
                        { year: "2024", closeRate: 14.9 },
                      ]}
                      margin={{ top: 28, right: 28, bottom: 0, left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" tickMargin={6} />
                      <YAxis
                        domain={[0, (max) => Math.ceil((max + 2) * 1.05)]}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip formatter={(v) => `${v}%`} />
                      <Bar dataKey="closeRate" fill={DONUT_CLOSE_COLOR} radius={[8, 8, 0, 0]}>
                        <LabelList dataKey="closeRate" position="top" offset={10} formatter={(v) => v.toFixed(1)} />
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* 하단 인디케이터 */}
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

        {/* 분석 결과 코멘트 */}
        <section className="mt-8">
          <div className="rounded-3xl bg-[#2F66F5] text-white p-5 sm:p-6 shadow-sm">
            <div className="text-sm opacity-90">🤖 분석 결과 코멘트</div>
            <p className="mt-1 leading-relaxed text-[15px]">
              이 아이디어는 {region} 인근에서 {category} 소비층을 겨냥한 경쟁력 있는 창업 아이템입니다.
              특히 SNS 확산 가능성과 차별화된 콘셉트가 강점입니다.
            </p>
          </div>
        </section>

        <footer className="mt-10 text-xs text-gray-500 border-t pt-6">
          <div>© {new Date().getFullYear()} My Service. All rights reserved.</div>
          <div className="mt-2">개인정보처리방침 | 문의 | Contact Us</div>
        </footer>
      </div>
    </section>
  );
}
