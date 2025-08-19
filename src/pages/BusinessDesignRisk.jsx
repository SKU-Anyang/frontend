import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * 비즈니스 설계 / 리스크 진단 — 스크린샷 스타일 버전
 * - 좌: 폼 (섹션 라인 + 라운드 + 스켈레톤 톤)
 * - 우: 상단 "비즈니스 설계" 2열 레이아웃 (점선 구분) / 하단 "폐업 리스크 분석" 파란 박스 2개
 * - 제출 전: 우측은 텍스트 없이 기본 틀만 노출
 * - 제출 후: 더미 결과 채움 (나중에 API 교체)
 */

export default function BusinessDesignRisk() {
  const navigate = useNavigate();
  const location = useLocation();

  const url = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [loading, setLoading] = useState(false);
  const [designed, setDesigned] = useState(null);

  // 폼 상태 (기본값은 URL 파라미터 or 예시)
  const [form, setForm] = useState({
    category: url.get("category") || "카페",
    region: url.get("region") || "범계",
    target: url.get("target") || "20대",
    budget: "1억",
    headcount: "2",
    size: "10 ~ 15",
    extra: "",
  });

  const onChange = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  // 제출 → 더미 결과 (API 교체 지점)
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // TODO: API 연동
    // const { data } = await axios.post("/api/business-design", form);
    // setDesigned(data);

    const { region, category, target, headcount, budget } = form;
    const result = {
      design: {
        입지_전략: [
          `${region} 핵심 동선 · 좌측 유동유입 임대 거리`,
          `${region}역/버스라인과 2분 동선 강점/스타벅스 인접`,
        ],
        타깃_분석: [
          `${target} 주 사용층 (체류형 + 테이크아웃 병행)`,
          `출퇴근/학원 라인 대비 ${category} 선호 지표 반영`,
        ],
        콘텐츠_차별화: [
          "포토존/무드라이팅/좌석 존 분리",
          "시즌 디스플레이 → SNS 바이럴",
        ],
        수익_전략: [
          "음료/디저트 마진 중심 + 시간대별 매출원 다변화",
          "굿즈/이벤트로 객단가 보조",
          `${budget} 내 인테리어 우선 배치`,
        ],
        가게명_추천: ["라떼타운", "모먼트 스튜디오", "스테이 무드"],
      },
      risk: {
        주요_리스크: [
          `${region} 1층 임대료 상향 (업력/입지 대비 부담)`,
          "콘셉트 포화 → 차별화 요소 필요",
          "회전율 둔화 위험 (체류형 좌석 증가 시)",
          `주말 피크 인력 부족 가능성 (현재 ${headcount}명 기준)`,
        ],
        완화_전략: [
          "2층·코너 대안 검토(관리비/임대료 최적화)",
          "시간대별 MD/좌석 운영으로 회전 확보",
          "SNS/커뮤니티 바이럴 패키지(인증 포인트 확실화)",
          "소규모 팝업 → 정식 전환 테스트",
        ],
      },
    };

    setTimeout(() => {
      setDesigned(result);
      setLoading(false);
    }, 500);
  };

  return (
    <section className="min-h-screen bg-[#F5F6F8]">
      {/* 상단 얇은 바 + 타이틀 */}
      <div className="sticky top-0 z-10 bg-white/85 backdrop-blur border-b">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black">←</button>
          <span className="text-sm text-gray-500">아이디어/ 시장성 진단</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-semibold text-gray-800">비즈니스 설계/ 리스크 진단</span>
        </div>
      </div>

      {/* 메인 2열 */}
      <div className="mx-auto w-full max-w-[1200px] px-6 py-8 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">
        {/* 좌측 카드 */}
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
                placeholder="예) 1억"
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
                placeholder="예) 10 ~ 15"
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
                  placeholder="예) 음료 판매, 디저트, 사진감 공간 대여, 굿즈, 포토존 운영"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="ml-auto block px-5 h-10 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "분석 중..." : "설계 및 진단"}
              </button>
            </div>
          </form>
        </aside>

        {/* 우측 큰 카드 */}
        <main className="bg-white rounded-[24px] border shadow-sm p-8">
          {/* 상단: 비즈니스 설계 */}
          <section>
            <h3 className="text-[20px] font-extrabold text-gray-900">비즈니스 설계</h3>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 좌 컬럼 */}
              <div className="space-y-8">
                <ColumnBox title="입지 전략" items={designed?.design.입지_전략} />
                <ColumnBox title="타깃 분석" items={designed?.design.타깃_분석} />
                <ColumnBox title="콘셉트 차별화" items={designed?.design.콘텐츠_차별화} />
              </div>

              {/* 점선 구분 + 우 컬럼 */}
              <div className="relative">
                {/* 세로 점선 (스크린샷처럼) */}
                <div className="hidden md:block absolute -left-4 top-0 h-full border-l border-dashed border-gray-300" />
                <div className="space-y-8">
                  <ColumnBox title="수익 전략" items={designed?.design.수익_전략} />
                  <ColumnBox title="가게명 추천" items={designed?.design.가게명_추천} pill />
                </div>
              </div>
            </div>

            {/* 얇은 가로선 */}
            <div className="h-[6px] w-full bg-gray-100 mt-8 rounded" />
          </section>

          {/* 하단: 폐업 리스크 분석 */}
          <section className="mt-6">
            <h3 className="text-[20px] font-extrabold text-gray-900">폐업 리스크 분석</h3>

            <div className="mt-4 space-y-4">
              <BluePanel title="주요 리스크">
                {designed ? (
                  <BulletList items={designed.risk.주요_리스크} />
                ) : null}
              </BluePanel>

              <BluePanel title="리스크 완화 전략">
                {designed ? (
                  <BulletList items={designed.risk.완화_전략} />
                ) :null}
              </BluePanel>
            </div>
          </section>
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
        {children || <div className="h-8 w-[220px] rounded-md bg-gray-100/80 border border-gray-200" />}
        {unit && <span className="text-sm text-gray-400">{unit}</span>}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-gray-200" />;
}

function ColumnBox({ title, items, pill = false }) {
  return (
    <div>
      <div className="text-[14px] font-semibold text-gray-900">{title}</div>
      {items ? (
        <ul className="mt-2 space-y-1.5 text-[14px] text-gray-800">
          {items.map((t, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-gray-400 select-none">•</span>
              {pill ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gray-100 border text-gray-700">
                  {t}
                </span>
              ) : (
                <span>{t}</span>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function BluePanel({ title, children }) {
  return (
    <div className="rounded-[18px] bg-[#E2E7F1] p-5">
      <div className="text-[13px] font-semibold text-gray-800">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-1.5 text-[14px] text-gray-800 leading-6">
      {items.map((t, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="text-gray-500">·</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function PlaceholderLines({ short = false }) {
  return (
    <div className="space-y-2">
      <div className="h-3 bg-gray-300/60 rounded" />
      <div className={`h-3 ${short ? "w-8/12" : "w-10/12"} bg-gray-300/60 rounded`} />
      <div className={`h-3 ${short ? "w-7/12" : "w-9/12"} bg-gray-300/60 rounded`} />
      {!short && <div className="h-3 w-6/12 bg-gray-300/60 rounded" />}
    </div>
  );
}
