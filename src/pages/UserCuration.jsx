import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadFavs, saveFavs, isFav, toggleFav } from "../utils/favorites";

export default function UserCuration() {
  const navigate = useNavigate();
  const [favs, setFavs] = useState([]);
  const [hiddenRecs, setHiddenRecs] = useState(() => new Set()); // 휴지통 눌러 숨긴 추천
  const scrollRef = useRef(null);

  useEffect(() => {
    setFavs(loadFavs());
  }, []);

  // 태그 기반 간단 추천 (더미) → 숨긴 카드 제외
  const baseRecs = useMemo(() => {
    const tagCount = new Map();
    favs.forEach(f => (f.tags || []).forEach(t => tagCount.set(t, (tagCount.get(t) || 0) + 1)));
    const top = [...tagCount.entries()].sort((a,b)=>b[1]-a[1]).slice(0,2).map(([t])=>t);

    if (top.length === 0) return DEFAULT_RECS;

    const scored = DEFAULT_RECS
      .map(r => ({ ...r, _score: (r.tags||[]).reduce((s,t)=>s + (top.includes(t)?1:0), 0) }))
      .sort((a,b)=>b._score - a._score || b.confidence - a.confidence);

    return scored.slice(0, 4);
  }, [favs]);

  const recommendations = useMemo(
    () => baseRecs.filter(r => !hiddenRecs.has(r.id)),
    [baseRecs, hiddenRecs]
  );

  const slide = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollBy({ left: dir * (w - 120), behavior: "smooth" });
  };

  // 추천 카드: 하트 토글 → 즐겨찾기 저장/해제 + 상단 찜 목록 새로고침
  const onToggleRecFav = (rec) => {
    toggleFav({
      id: rec.id,
      title: rec.title,
      region: "추천",
      category: rec.subtitle || "추천 아이템",
      tags: rec.tags || [],
    });
    setFavs(loadFavs()); // 상단 찜 목록 즉시 반영
  };

  // 추천 카드: 휴지통 → 화면에서만 숨김
  const onDeleteRec = (id) => {
    setHiddenRecs(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <section className="min-h-screen bg-[#F6F8FB]">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 space-y-10">

        {/* ── 상단: 사용자 아이디어 찜 목록 ── */}
        <div className="bg-white rounded-3xl border shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">사용자 아이디어 찜 목록</h2>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => slide(-1)} className="h-9 w-9 rounded-full border hover:bg-gray-50">‹</button>
              <button onClick={() => slide(1)} className="h-9 w-9 rounded-full border hover:bg-gray-50">›</button>
            </div>
          </div>

          {favs.length === 0 ? (
            <div className="text-sm text-gray-500 py-8">
              아직 찜한 아이디어가 없습니다. 다양한 페이지에서 ♥ 버튼으로 찜해보세요!
            </div>
          ) : (
            <div className="relative">
              <div className="md:hidden mb-3 flex justify-end gap-2">
                <button onClick={() => slide(-1)} className="h-8 w-8 rounded-full border">‹</button>
                <button onClick={() => slide(1)} className="h-8 w-8 rounded-full border">›</button>
              </div>

              <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                {favs.map(f => (
                  <div key={f.id} className="min-w-[280px] max-w-[280px] snap-start">
                    <FavCard
                      item={f}
                      onView={() => navigate("/market-insights", { state: { fromCuration: true, item: f } })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── 하단: 유사 창업 아이템 추천 (하트 + 휴지통) ── */}
        <div>
          <h3 className="text-lg font-semibold mb-2">유사 창업 아이템 추천</h3>
          <p className="text-sm text-gray-500 mb-4">
            찜한 항목과 유사한 창업 아이디어를 추천했어요.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recommendations.map((rec) => (
              <RecCard
                key={rec.id}
                rec={rec}
                liked={isFav(rec.id)}
                onToggleLike={() => onToggleRecFav(rec)}
                onDelete={() => onDeleteRec(rec.id)}
              />
            ))}
            {recommendations.length === 0 && (
              <div className="text-sm text-gray-500 p-6 bg-white rounded-2xl border">
                표시할 추천이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 카드 컴포넌트 ── */

// 상단 찜 카드: CTA는 "시장성 분석 보기"만
function FavCard({ item, onView }) {
  return (
    <div className="h-full bg-white rounded-2xl border shadow-sm p-4 flex flex-col">
      <div className="text-[15px] font-semibold text-gray-900">{item.title}</div>
      <div className="text-xs text-gray-500 mt-1">📍 {item.region} · {item.category}</div>
      <div className="mt-2 text-xs text-blue-700 line-clamp-1">
        {(item.tags || []).slice(0,3).map(t => `#${t}`).join(" ")}
      </div>

      <div className="mt-auto pt-3">
        <button
          onClick={onView}
          className="px-3 h-9 rounded-full bg-blue-600 text-white text-xs hover:bg-blue-700"
        >
          시장성 분석 보기
        </button>
      </div>
    </div>
  );
}

// 하단 추천 카드: 하트(찜) + 휴지통(숨기기)
function RecCard({ rec, liked, onToggleLike, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      <div className="text-[15px] font-semibold">{rec.title}</div>
      <div className="mt-1 text-xs text-blue-700">{rec.subtitle}</div>

      <ul className="mt-3 text-sm text-gray-800 space-y-1 list-disc pl-5">
        {rec.points.map((p,i) => <li key={i}>{p}</li>)}
      </ul>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {(rec.tags || []).map(t => <span key={t} className="mr-2">#{t}</span>)}
        </div>

        <div className="flex items-center gap-2">
          {/* 하트(찜 토글) */}
          <button
            onClick={onToggleLike}
            title="찜"
            className="h-9 w-9 grid place-items-center rounded-full border hover:bg-gray-50"
          >
            <span className="text-[16px]">{liked ? "❤️" : "🤍"}</span>
          </button>
          {/* 휴지통(카드 숨기기) */}
          <button
            onClick={onDelete}
            title="삭제"
            className="h-9 w-9 grid place-items-center rounded-full border hover:bg-gray-50"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 추천 더미 데이터 ── */
const DEFAULT_RECS = [
  { id:"rec-1", title:"복카페 + 작가의 방", subtitle:"특화공간형 감성 카페", tags:["감성","MZ"], confidence:0.9,
    points:["작가/20대 타깃", "북 큐레이션+포토존", "소형 평수 최적화"] },
  { id:"rec-2", title:"루프탑 힐링 바", subtitle:"낮엔 스터디, 밤엔 칵테일", tags:["야간수요","포토"], confidence:0.85,
    points:["낮/밤 복합 매출", "유동인구 집중", "SNS 확산 유리"] },
  { id:"rec-3", title:"감성 스튜디오 카페", subtitle:"낮 카페, 밤 촬영 대여", tags:["감성","포토"], confidence:0.82,
    points:["Z세대 선호", "대여로 비수기 완화", "테이크아웃 회전"] },
  { id:"rec-4", title:"플라워 감성 DIY 카페", subtitle:"체험형 클래스 운영", tags:["클래스","감성"], confidence:0.8,
    points:["재방문 유도", "소품/키트 부가매출", "SNS 확산 강점"] },
];
