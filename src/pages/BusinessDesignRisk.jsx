// src/pages/BusinessDesignRisk.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

/** 로컬 개발에서 EC2로 직접 호출 */
const API_BASE = "http://3.36.114.249:8080"; // 필요 시 .env로 분리: VITE_API_BASE

export default function BusinessDesignRisk() {
  const navigate = useNavigate();
  const location = useLocation();

  const url = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [loading, setLoading] = useState(false);
  const [designed, setDesigned] = useState(null); // 서버 응답(JSON) 또는 {error, debug}

  // 폼 상태
  const [form, setForm] = useState({
    category: url.get("category") || "카페",
    region: url.get("region") || "범계",
    target: url.get("target") || "20대",
    budget: "100000000", // 숫자 문자열
    headcount: "2",
    size: "10", // 평수
    extra: "",
  });

  const onChange = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  // ---- 요청 페이로드 빌더 (스키마 불확실 시 빠르게 스위칭) ----
  function buildPayload(form, variant = "v1") {
    const base = {
      industry: String(form.category || ""),
      region: String(form.region || ""),
      target: [String(form.target || "")],
      budgetKrw: Number((form.budget ?? "").toString().replace(/[^0-9]/g, "")) || 0,
      staff: Number(form.headcount) || 0,
      areaPyeong: Number(form.size) || 0,
      notes: String(form.extra || ""),
    };

    if (variant === "v2") {
      // 서버가 다른 키를 기대할 때를 대비한 대체안
      return {
        category: base.industry,
        region: base.region,
        targets: base.target,
        budget: base.budgetKrw,
        staff: base.staff,
        area: base.areaPyeong,
        notes: base.notes,
      };
    }
    return base;
  }

  // ---- 제출 → API 호출 ----
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDesigned(null);

    try {
      // 1차(기본 스키마)
      let payload = buildPayload(form, "v1");
      let res = await axios.post(`${API_BASE}/api/ai/plan`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setDesigned(res.data);
    } catch (err1) {
      // 2차(대체 스키마) 한 번 더 시도
      try {
        let payload2 = buildPayload(form, "v2");
        let res2 = await axios.post(`${API_BASE}/api/ai/plan`, payload2, {
          headers: { "Content-Type": "application/json" },
        });
        setDesigned(res2.data);
      } catch (err2) {
        const status = err2.response?.status;
        const body = err2.response?.data;
        setDesigned({
          error: `❌ 서버 오류 (${status ?? "?"})`,
          debug: typeof body === "string" ? body : JSON.stringify(body, null, 2),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#F5F6F8]">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-8 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">
        {/* 좌측 입력 폼 */}
        <aside className="bg-white rounded-[24px] border shadow-sm p-8">
          <h2 className="text-[20px] font-extrabold text-gray-900">창업 희망 업종 입력</h2>
          <p className="text-xs text-gray-400 mt-1">
            정보를 바탕으로 비즈니스를 설계하고 폐업 리스크를 분석해 드려요.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            <InputRow label="업종">
              <input
                value={form.category}
                onChange={onChange("category")}
                className="w-[220px] h-8 rounded-md bg-gray-100/80 border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="예) 카페"
              />
            </InputRow>

            <Divider />

            <InputRow label="지역">
              <input
                value={form.region}
                onChange={onChange("region")}
                className="w-[220px] h-8 rounded-md bg-gray-100/80 border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="예) 범계"
              />
            </InputRow>

            <Divider />

            <InputRow label="주요 타깃층">
              <input
                value={form.target}
                onChange={onChange("target")}
                className="w-[220px] h-8 rounded-md bg-gray-100/80 border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="예) 20대"
              />
            </InputRow>

            <Divider />

            <InputRow label="예상 창업 예산" unit="원">
              <input
                value={form.budget}
                onChange={onChange("budget")}
                className="w-[220px] h-8 rounded-md bg-gray-100/80 border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="예) 100000000"
              />
            </InputRow>

            <Divider />

            <InputRow label="운영 인력" unit="명">
              <input
                value={form.headcount}
                onChange={onChange("headcount")}
                className="w-[220px] h-8 rounded-md bg-gray-100/80 border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="예) 2"
              />
            </InputRow>

            <Divider />

            <InputRow label="점포 규모" unit="평">
              <input
                value={form.size}
                onChange={onChange("size")}
                className="w-[220px] h-8 rounded-md bg-gray-100/80 border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="예) 10"
              />
            </InputRow>

            <Divider />

            <div>
              <div className="text-sm font-medium text-gray-700">추가 정보</div>
              <div className="mt-2">
                <textarea
                  rows={3}
                  value={form.extra}
                  onChange={onChange("extra")}
                  className="w-full rounded-lg bg-gray-100/80 border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                  placeholder="예) 음료/디저트, 포토존, 굿즈 등"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="ml-auto block px-5 h-10 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "분석 중..." : "설계 및 진단"}
              </button>
            </div>
          </form>
        </aside>

        {/* 우측 결과 */}
        <main className="bg-white rounded-[24px] border shadow-sm p-8">
          {/* 에러/디버그 */}
          {designed?.error && (
            <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-700 whitespace-pre-wrap mb-4">
              {designed.error}
              {designed.debug ? `\n\n${designed.debug}` : ""}
            </div>
          )}

          {/* 정상 응답 */}
          {designed && !designed.error && (
            <>
              {/* 비즈니스 설계 */}
              <section>
                <h3 className="text-[20px] font-extrabold text-gray-900">비즈니스 설계</h3>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <ColumnBox
                      title="입지 전략"
                      items={designed.design?.positioning ? [designed.design.positioning] : []}
                    />
                    <ColumnBox
                      title="타깃 분석"
                      items={designed.design?.targeting ? [designed.design.targeting] : []}
                    />
                    <ColumnBox
                      title="콘셉트 차별화"
                      items={designed.design?.differentiation ? [designed.design.differentiation] : []}
                    />
                  </div>

                  <div className="relative">
                    <div className="hidden md:block absolute -left-4 top-0 h-full border-l border-dashed border-gray-300" />
                    <div className="space-y-8">
                      <ColumnBox
                        title="수익 전략"
                        items={designed.design?.revenue ? [designed.design.revenue] : []}
                      />
                      <ColumnBox
                        title="가게명 추천"
                        items={Array.isArray(designed.design?.nameIdeas) ? designed.design.nameIdeas : []}
                        pill
                      />
                    </div>
                  </div>
                </div>

                <div className="h-[6px] w-full bg-gray-100 mt-8 rounded" />
              </section>

              {/* 폐업 리스크 */}
              <section className="mt-6">
                <h3 className="text-[20px] font-extrabold text-gray-900">폐업 리스크 분석</h3>
                <div className="mt-4 space-y-4">
                  {Array.isArray(designed.risk?.major) &&
                    designed.risk.major.map((r, i) => (
                      <BluePanel key={i} title={r.title}>
                        <p className="leading-6">⚠️ {r.why}</p>
                        <p className="leading-6">심각도: {r.severity}</p>
                        <p className="leading-6">완화: {r.mitigation}</p>
                      </BluePanel>
                    ))}
                </div>
              </section>

              {/* 📊 시장 지표
              <section className="mt-6">
                <h3 className="text-[20px] font-extrabold text-gray-900">시장 지표</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricCard
                    title="폐업률"
                    value={
                      designed.metrics?.closureRate?.value !== undefined
                        ? `${designed.metrics.closureRate.value}%`
                        : "-"
                    }
                    desc={
                      designed.metrics?.closureRate
                        ? `${designed.metrics.closureRate.region}, ${designed.metrics.closureRate.industry}, ${designed.metrics.closureRate.year}`
                        : "-"
                    }
                  />
                  <MetricCard
                    title="경쟁 지점 수"
                    value={
                      designed.metrics?.competition?.poi !== undefined
                        ? `${designed.metrics.competition.poi}개`
                        : "-"
                    }
                    desc={
                      designed.metrics?.competition
                        ? `반경 ${designed.metrics.competition.radiusM}m`
                        : "-"
                    }
                  />
                  <MetricCard
                    title="평균 임대료"
                    value={
                      designed.metrics?.avgRent?.pyeong !== undefined
                        ? `${designed.metrics.avgRent.pyeong} 원/평`
                        : "-"
                    }
                    desc={`출처: ${designed.metrics?.avgRent?.source || "-"}`}
                  />
                </div>
              </section> */}
            </>
          )}
        </main>
      </div>
    </section>
  );
}

/* ───────── 작은 구성요소들 ───────── */

function InputRow({ label, unit, children }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="flex items-center gap-2">
        {children}
        {unit && <span className="text-sm text-gray-400">{unit}</span>}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-gray-200" />;
}

function ColumnBox({ title, items = [], pill = false }) {
  if (!Array.isArray(items)) items = [];
  return (
    <div>
      <div className="text-[14px] font-semibold text-gray-900">{title}</div>
      {items.length > 0 && (
        <ul className="mt-2 space-y-1.5 text-[14px] text-gray-800">
          {items.map((t, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-gray-400 select-none">•</span>
              {pill ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gray-100 border text-gray-700">
                  {String(t)}
                </span>
              ) : (
                <span>{String(t)}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BluePanel({ title, children }) {
  return (
    <div className="rounded-[18px] bg-[#E2E7F1] p-5">
      <div className="text-[13px] font-semibold text-gray-800">{title}</div>
      <div className="mt-2 text-sm text-gray-700">{children}</div>
    </div>
  );
}

function MetricCard({ title, value, desc }) {
  return (
    <div className="rounded-[18px] bg-white border shadow-sm p-5 text-center">
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className="text-xl font-bold text-gray-900 mt-2">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{desc}</div>
    </div>
  );
}
