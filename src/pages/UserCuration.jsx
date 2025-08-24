// src/pages/UserCuration.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loadFavs, isFav, toggleFav } from "../utils/favorites";

/**
 * ⚙️ API_BASE
 * - dev에서 Vite 프록시를 쓰면 .env에 VITE_API_BASE="" 두고 /api/... 경로로만 호출
 * - 배포에서 직접 붙이면 서버 주소(가능하면 https) 지정
 * - 끝 슬래시는 제거해서 경로 꼬임 방지
 */
const API_BASE = (import.meta.env.VITE_API_BASE ?? "http://3.36.114.249:8080").replace(/\/$/, "");

/** 익명 사용자 ID 확보 (없으면 생성해서 localStorage 보관) */
function getOrCreateAnonId() {
  let id = localStorage.getItem("anonId");
  if (!id) {
    id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    localStorage.setItem("anonId", id);
  }
  return id;
}

/** 문자열 그대로 받기 위한 axios 인스턴스 (스웨거 응답이 string) */
const ax = axios.create({
  baseURL: API_BASE,
  headers: { Accept: "*/*" },
  transformResponse: [(data) => data], // ← text 그대로
});

/** 모든 요청에 익명 사용자 헤더 자동 첨부 */
ax.interceptors.request.use((config) => {
  const anonId = getOrCreateAnonId();
  // 서버가 기대하는 키 이름으로 변경 가능: X-User-Id, X-Client-Id 등
  config.headers["X-Anon-Id"] = anonId;

  // (선택) 로그인 토큰도 있으면 첨부
  const token = localStorage.getItem("accessToken");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

/* ---------------------- 문자열 응답 파서 (보강판) ---------------------- */
/**
 * 기대형식 1) JSON 문자열:  '[{id,title,subtitle,tags,confidence,points:[...]}]'
 * 기대형식 2) JSON 단일 객체: '{title:"...", points:[...]}'
 * 기대형식 3) 마크다운/텍스트:
 *   # 제목 | 부제 | 태그: tag1,tag2 | 점수:0.87
 *   - 포인트1
 *   - 포인트2
 *   (빈 줄로 다음 아이템)
 * 기대형식 4) 빈 줄 없이 한 덩어리: "제목 | 부제 ... \n - p1 \n - p2 \n - p3"
 * 기대형식 5) 전부 불릿만: "- 아이템A\n- 아이템B\n..." → 제목은 첫 줄, 나머지는 포인트
 */
function parseCuration(text) {
  if (!text || typeof text !== "string") return [];
  let src = String(text).trim();

  // ```json ... ``` 또는 ``` ... ``` 코드펜스 제거
  src = src.replace(/```[\s\S]*?```/g, (m) => m.replace(/```[a-zA-Z]*\n?|\n?```/g, "").trim());

  // 0) 양끝에 따옴표 감싸진 JSON 문자열 제거 (ex: "\"[ ... ]\"")
  if ((src.startsWith('"') && src.endsWith('"')) || (src.startsWith("'") && src.endsWith("'"))) {
    try {
      const unq = JSON.parse(src);
      if (typeof unq === "string") src = unq.trim();
    } catch {}
  }

  // 1) JSON 전체 시도 (배열)
  try {
    const data = JSON.parse(src);
    if (Array.isArray(data)) return normalizeJsonArray(data);
    // 1.1) 단일 객체 한 개만 오는 경우
    if (data && typeof data === "object" && (data.title || data.points || data.subtitle)) {
      return normalizeJsonArray([data]);
    }
  } catch {}

  // 1.5) 본문에 JSON 배열/객체만 숨어있는 경우: 가장 바깥 대괄호/중괄호 영역만 추출 후 재시도
  const jsonArrayPart = src.match(/\[[\s\S]*\]/);
  if (jsonArrayPart) {
    try {
      const data = JSON.parse(jsonArrayPart[0]);
      if (Array.isArray(data)) return normalizeJsonArray(data);
    } catch {}
  }
  const jsonObjPart = src.match(/\{[\s\S]*\}/);
  if (jsonObjPart) {
    try {
      const data = JSON.parse(jsonObjPart[0]);
      if (Array.isArray(data)) return normalizeJsonArray(data);
      if (data && typeof data === "object") return normalizeJsonArray([data]);
    } catch {}
  }

  // 2) 마크다운/텍스트 파싱
  // 2.0) 라인 단위로 준비
  const allLines = src.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

  // 2.1) 블록 쪼개기: 빈 줄 기준 + 제목 패턴(#, 숫자.), 또는 '---' 구분도 고려
  let blocks = src.split(/\n{2,}|^-{3,}\s*$/m).filter((b) => b.trim().length);

  // 빈 줄이 전혀 없다면, 제목 라인(헤더/숫자/파이프 포함) 기준으로 약하게 나눔
  if (blocks.length === 1) {
    const temp = [];
    let current = [];
    const pushBlock = () => {
      if (current.length) {
        temp.push(current.join("\n"));
        current = [];
      }
    };
    const isHeaderish = (line) =>
      /^#{1,6}\s+/.test(line) ||                    // Markdown header
      /^\d+\s*[.)]\s+/.test(line) ||                // "1) " or "1. "
      /[|]/.test(line);                             // "제목 | 부제 | ..."
    for (const line of allLines) {
      if (isHeaderish(line) && current.length) pushBlock();
      current.push(line);
    }
    pushBlock();
    if (temp.length > 1) blocks = temp;
  }

  // 그래도 전부 한 블럭이라면 그 한 블럭만 해석
  const items = [];
  for (const rawBlock of blocks) {
    const lines = rawBlock.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    if (!lines.length) continue;

    // 헤더 후보: 첫 번째 "비-불릿" 라인
    let headIdx = lines.findIndex((ln) => !/^[-*•]\s+/.test(ln) && !/^\d+\s*[.)]\s+/.test(ln));
    if (headIdx === -1) headIdx = 0; // 전부 불릿이면 첫 줄을 제목으로

    let head = lines[headIdx]
      .replace(/^\d+\s*[.)]\s*/, "") // "1) "
      .replace(/^[-*•]\s*/, "") // "- "
      .replace(/^#+\s*/, ""); // "# "

    const parts = head.split("|").map((s) => s.trim());
    const [pTitle, pSubtitle, pTags, pConf] = parts;

    let title = pTitle || head || "제목 없음";
    let subtitle = pSubtitle || "";
    let tags = [];
    let confidence = 0;

    if (pTags && /태그|tags/i.test(pTags)) {
      const m = pTags.split(/[:：]/)[1] || "";
      tags = m.split(/[,\s]+/).filter(Boolean);
    }
    if (pConf && /(점수|confidence)/i.test(pConf)) {
      const m = parseFloat((pConf.split(/[:：]/)[1] || "").trim());
      confidence = isNaN(m) ? 0 : m;
    }

    // 포인트: 헤더 줄 제외 + 불릿/번호 제거
    const points = lines
      .filter((_, idx) => idx !== headIdx)
      .map((s) => s.replace(/^\d+\s*[.)]\s*/, "").replace(/^[-*•]\s*/, "").trim())
      .filter(Boolean);

    // 전부 불릿만이었고 헤더를 첫 줄에서 만들었다면, 첫 줄을 title로, 나머지를 points로
    const item = {
      id: `rec-${items.length + 1}`,
      title,
      subtitle,
      tags,
      confidence,
      points,
    };
    items.push(item);
  }

  return items;
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

/* ---------------------------- 메인 컴포넌트 ---------------------------- */

export default function UserCuration() {
  const navigate = useNavigate();
  const [favs, setFavs] = useState([]);
  const [hiddenRecs, setHiddenRecs] = useState(() => new Set()); // 휴지통 눌러 숨긴 추천
  const [apiRecs, setApiRecs] = useState([]);     // API 결과
  const [curLoading, setCurLoading] = useState(false);
  const [curError, setCurError] = useState("");
  const [rawResp, setRawResp] = useState("");     // 디버그용 원시 응답
  const scrollRef = useRef(null);

  // 🧪 개발: 즐겨찾기 없어도 API를 1회 강제 호출 (하드코딩 파라미터)
  const USE_HARDCODE_ON_FIRST_LOAD = true; // ← 디버그용으로 'true'

  // 최초 즐겨찾기 로드 (새 배열로 참조 보장)
  useEffect(() => {
    const loaded = loadFavs() || [];
    setFavs([...loaded]);
  }, []);

  // 폴백용 로컬 추천 (찜 태그 상위 1~2개 기반)
  const baseRecs = useMemo(() => {
    const tagCount = new Map();
    favs.forEach((f) => (f.tags || []).forEach((t) => tagCount.set(t, (tagCount.get(t) || 0) + 1)));
    const top = [...tagCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([t]) => t);

    if (top.length === 0) return DEFAULT_RECS;

    const scored = DEFAULT_RECS
      .map((r) => ({ ...r, _score: (r.tags || []).reduce((s, t) => s + (top.includes(t) ? 1 : 0), 0) }))
      .sort((a, b) => b._score - a._score || b.confidence - a.confidence);

    return scored.slice(0, 4);
  }, [favs]);

  // ✅ API 호출: GET /api/ai/curation/from-bookmarks (string 응답)
  useEffect(() => {
    // 하드코딩 모드: 즐겨찾기 없이도 API를 무조건 한 번 호출
    let region = "안양";
    let profile = "카페,감성";
    const take = 4;

    if (!USE_HARDCODE_ON_FIRST_LOAD) {
      // favs 기반 파라미터 구성
      region = favs?.[0]?.region || "안양";
      const cnt = new Map();
      favs.forEach((f) => (f.tags || []).forEach((t) => cnt.set(t, (cnt.get(t) || 0) + 1)));
      profile = [...cnt.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([t]) => t).join(",") || "일반";
    }

    console.log("[CURATION] API_BASE:", API_BASE || "(proxy)");
    console.log("[CURATION] params →", { region, profile, take });

    // ⚠️ 디버그 단계: 즐겨찾기 없어도 호출 (가드 비활성화)
    // if (!USE_HARDCODE_ON_FIRST_LOAD && (!favs || favs.length === 0)) {
    //   setApiRecs([]);
    //   setRawResp("");
    //   setCurError("");
    //   return;
    // }

    setCurLoading(true);
    setCurError("");
    setRawResp("");

    ax
      .get("/api/ai/curation/from-bookmarks", { params: { region, profile, take } })
      .then((res) => {
        const text = res.data ?? "";
        console.log("[CURATION] status", res.status, "len", String(text).length);
        console.log("[CURATION] raw response >>>\n", text);

        setRawResp(String(text).slice(0, 2000)); // 화면에서 첫 2000자 확인
        const parsed = parseCuration(String(text));
        setApiRecs(Array.isArray(parsed) && parsed.length ? parsed : []);
      })
      .catch((err) => {
        console.error("[CURATION] error", err?.message, err);
        setApiRecs([]);
        setCurError(err?.response?.data || err?.message || "추천 불러오는 중 오류가 발생했어요.");
      })
      .finally(() => setCurLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [USE_HARDCODE_ON_FIRST_LOAD ? false : favs]); // 하드코딩 모드면 1회, 아니면 favs 변동 시

  // 최종 추천: API 결과 우선, 없으면 폴백 — 숨김 제외
  const recommendations = useMemo(() => {
    const src = apiRecs.length ? apiRecs : baseRecs;
    console.log("[CURATION] using", apiRecs.length ? "API" : "FALLBACK", "items:", src.length);
    return src.filter((r) => !hiddenRecs.has(r.id));
  }, [apiRecs, baseRecs, hiddenRecs]);

  const slide = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollBy({ left: dir * (w - 120), behavior: "smooth" });
  };

  // 추천 카드: 하트 토글 → 즐겨찾기 저장/해제 + 상단 찜 목록 즉시 갱신
  const onToggleRecFav = (rec) => {
    toggleFav({
      id: rec.id,
      title: rec.title,
      region: "추천",
      category: rec.subtitle || "추천 아이템",
      tags: rec.tags || [],
    });
    const loaded = loadFavs() || [];
    setFavs([...loaded]);
  };

  // 추천 카드: 휴지통 → 화면에서만 숨김
  const onDeleteRec = (id) => {
    setHiddenRecs((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <section className="min-h-screen bg-[#F6F8FB]">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 space-y-10">
        {/* 상단: 사용자 아이디어 찜 목록 */}
        <div className="bg-white rounded-3xl border shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">사용자 아이디어 찜 목록</h2>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => slide(-1)} className="h-9 w-9 rounded-full border hover:bg-gray-50">
                ‹
              </button>
              <button onClick={() => slide(1)} className="h-9 w-9 rounded-full border hover:bg-gray-50">
                ›
              </button>
            </div>
          </div>

          {favs.length === 0 ? (
            <div className="text-sm text-gray-500 py-8">
              아직 찜한 아이디어가 없습니다. 다양한 페이지에서 ♥ 버튼으로 찜해보세요!
            </div>
          ) : (
            <div className="relative">
              <div className="md:hidden mb-3 flex justify-end gap-2">
                <button onClick={() => slide(-1)} className="h-8 w-8 rounded-full border">
                  ‹
                </button>
                <button onClick={() => slide(1)} className="h-8 w-8 rounded-full border">
                  ›
                </button>
              </div>

              <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                {favs.map((f) => (
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

        {/* 하단: 유사 창업 아이템 추천 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">유사 창업 아이템 추천</h3>
            {curLoading ? (
              <span className="text-xs px-2 py-1 rounded bg-gray-100">Loading…</span>
            ) : (
              <span
                className={`text-xs px-2 py-1 rounded ${
                  apiRecs.length ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"
                }`}
              >
                {apiRecs.length ? "API" : "LOCAL"}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-4">찜한 항목과 유사한 창업 아이디어를 추천했어요.</p>

          {/* 에러 & 원시 응답(디버그) */}
          {curError && <div className="text-sm text-red-600 mb-2">❌ {String(curError)}</div>}
          {rawResp && (
            <pre className="text-xs text-slate-700 bg-slate-50 border rounded p-2 mb-3 overflow-x-auto">
{rawResp}
            </pre>
          )}

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
              <div className="text-sm text-gray-500 p-6 bg-white rounded-2xl border">표시할 추천이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- 카드 컴포넌트 ---------------------------- */

// 상단 찜 카드: CTA는 "시장성 분석 보기"만
function FavCard({ item, onView }) {
  return (
    <div className="h-full bg-white rounded-2xl border shadow-sm p-4 flex flex-col">
      <div className="text-[15px] font-semibold text-gray-900">{item.title}</div>
      <div className="text-xs text-gray-500 mt-1">
        📍 {item.region} · {item.category}
      </div>
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

// 하단 추천 카드: 하트(찜) + 휴지통(숨기기)
function RecCard({ rec, liked, onToggleLike, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      <div className="text-[15px] font-semibold">{rec.title}</div>
      <div className="mt-1 text-xs text-blue-700">{rec.subtitle}</div>

      <ul className="mt-3 text-sm text-gray-800 space-y-1 list-disc pl-5">
        {(rec.points || []).map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {(rec.tags || []).map((t) => (
            <span key={t} className="mr-2">
              #{t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* 하트(찜 토글) */}
          <button onClick={onToggleLike} title="찜" className="h-9 w-9 grid place-items-center rounded-full border hover:bg-gray-50">
            <span className="text-[16px]">{liked ? "❤️" : "🤍"}</span>
          </button>
          {/* 휴지통(카드 숨기기) */}
          <button onClick={onDelete} title="삭제" className="h-9 w-9 grid place-items-center rounded-full border hover:bg-gray-50">
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- 폴백 더미 데이터 ---------------------------- */
const DEFAULT_RECS = [
  {
    id: "rec-1",
    title: "복카페 + 작가의 방",
    subtitle: "특화공간형 감성 카페",
    tags: ["감성", "MZ"],
    confidence: 0.9,
    points: ["작가/20대 타깃", "북 큐레이션+포토존", "소형 평수 최적화"],
  },
  {
    id: "rec-2",
    title: "루프탑 힐링 바",
    subtitle: "낮엔 스터디, 밤엔 칵테일",
    tags: ["야간수요", "포토"],
    confidence: 0.85,
    points: ["낮/밤 복합 매출", "유동인구 집중", "SNS 확산 유리"],
  },
  {
    id: "rec-3",
    title: "감성 스튜디오 카페",
    subtitle: "낮 카페, 밤 촬영 대여",
    tags: ["감성", "포토"],
    confidence: 0.82,
    points: ["Z세대 선호", "대여로 비수기 완화", "테이크아웃 회전"],
  },
  {
    id: "rec-4",
    title: "플라워 감성 DIY 카페",
    subtitle: "체험형 클래스 운영",
    tags: ["클래스", "감성"],
    confidence: 0.8,
    points: ["재방문 유도", "소품/키트 부가매출", "SNS 확산 강점"],
  },
];
