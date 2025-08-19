import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ── 더미 데이터 (마커용; 화면엔 좌표 안 노출) ── */
const DUMMY_STORES = [
  { id: "goodweather", name: "카페굿웨더 범계", category: "카페/디저트", desc: "커피와 로스터리 강점, 감성 브랜딩", review: 683, lat: 37.389532, lng: 126.951829, image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800" },
  { id: "butterb",    name: "버터비버 범계본점", category: "카페/디저트", desc: "수제 베이커리와 살살 녹는 맛",   review: 992, lat: 37.38992,  lng: 126.95369,  image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800" },
  { id: "orosea",     name: "오르세커피",       category: "아메리카노·쿠폰", desc: "다양한 카페인 디저트로 행복 충전", review: 412, lat: 37.38872,  lng: 126.95261,  image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800" },
];

/* ── Kakao SDK 로더 (services 포함: 지오코딩/키워드검색) ── */
function loadKakaoSdk(appKey) {
  return new Promise((resolve, reject) => {
    if (!appKey) return reject(new Error("KAKAO APP KEY missing (.env 확인)"));
    if (window.kakao?.maps) return resolve(window.kakao);
    const url = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
    const s = document.createElement("script");
    s.src = url;
    s.async = true;
    s.onload = () => {
      try { window.kakao.maps.load(() => resolve(window.kakao)); }
      catch { reject(new Error("kakao.maps.load failed — JS키/도메인/제품 활성화 확인")); }
    };
    s.onerror = () => reject(new Error(`Kakao SDK load failed: ${url}`));
    document.head.appendChild(s);
  });
}

export default function SimilarStores() {
  const navigate = useNavigate();
  const appKey = import.meta.env.VITE_KAKAO_MAP_KEY;

  // refs
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const markersRef = useRef([]);
  const infoRef = useRef([]);
  const circleRef = useRef(null);
  const searchMarkerRef = useRef(null); // ✅ 검색 위치 마커

  // 검색 상태: 입력값 vs 실행된 검색어(커밋)
  const [input, setInput]       = useState("범계, 카페"); // 인풋 바인딩
  const [committed, setCommitted] = useState("");         // 검색 실행된 값 (처음엔 비워서 리스트 안 보이게)
  const [hasSearched, setHasSearched] = useState(false);  // 리스트 노출 트리거
  const [radius, setRadius]     = useState(500);
  const [sort, setSort]         = useState("relevance");
  const [list]                  = useState(DUMMY_STORES); // API 붙이면 서버 목록

  // 토큰화(리스트 필터용). 지도 이동은 커밋된 검색어 기준.
  const tokens = useMemo(
    () => committed.replace(/,/g, " ").toLowerCase().split(/\s+/).filter(Boolean),
    [committed]
  );
  const regionToken = tokens[0] || ""; // 지오코딩에 사용(예: "남양주", "범계")

  // 리스트 필터/정렬 — ✅ 검색이 실행된 뒤에만 필터링
  const filtered = useMemo(() => {
    if (!hasSearched) return []; // 검색 이전에는 리스트 비노출
    let arr = [...list];
    if (tokens.length) {
      arr = arr.filter((s) => {
        const hay = (s.name + " " + s.category + " " + s.desc).toLowerCase();
        return tokens.every((t) => hay.includes(t));
      });
    }
    if (sort === "review") arr.sort((a, b) => b.review - a.review);
    return arr;
  }, [hasSearched, list, tokens, sort]);

  // 검색 실행 핸들러 (Enter/버튼)
  const onSearch = () => {
    const q = input.trim();
    if (!q) return;
    setCommitted(q);
    setHasSearched(true);
  };

  // Enter 처리
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch();
    }
  };

  /* 1) 지도 최초 1회 생성 */
  useEffect(() => {
    let cleanup = () => {};
    (async () => {
      const kakao = await loadKakaoSdk(appKey);
      if (!mapRef.current) return;

      const center = new kakao.maps.LatLng(37.3895, 126.9525); // 기본: 범계
      const map = new kakao.maps.Map(mapRef.current, { center, level: 4 });
      mapObjRef.current = map;

      const circle = new kakao.maps.Circle({
        center,
        radius,
        strokeWeight: 2,
        strokeColor: "#4B74FF",
        strokeOpacity: 0.6,
        strokeStyle: "dashed",
        fillColor: "#4b74ff",
        fillOpacity: 0.07,
      });
      circle.setMap(map);
      circleRef.current = circle;

      cleanup = () => {
        circle.setMap(null);
        infoRef.current.forEach((iw) => iw.close());
        markersRef.current.forEach((m) => m.setMap(null));
        if (searchMarkerRef.current) searchMarkerRef.current.setMap(null);
        infoRef.current = [];
        markersRef.current = [];
        searchMarkerRef.current = null;
      };
    })();
    return () => cleanup();
  }, [appKey]);

  /* 2) 반경 변경 시 원의 반경만 갱신 */
  useEffect(() => {
    if (circleRef.current) circleRef.current.setRadius(radius);
  }, [radius]);

  /* 3) ✅ 커밋된 검색어(regionToken) 변경 시: 지오코딩 → 지도/원 중심 이동 + 검색 마커 표시 */
  useEffect(() => {
    if (!mapObjRef.current || !window.kakao || !regionToken) return;
    const kakao = window.kakao;
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(regionToken, (data, status) => {
      if (status !== kakao.maps.services.Status.OK || !data.length) return;
      const { y, x } = data[0]; // y: lat, x: lng
      const center = new kakao.maps.LatLng(parseFloat(y), parseFloat(x));

      // 지도/원 이동
      mapObjRef.current.setCenter(center);
      mapObjRef.current.setLevel(4);
      if (circleRef.current) circleRef.current.setPosition(center);

      // ✅ 검색 위치 마커 갱신
      if (searchMarkerRef.current) searchMarkerRef.current.setMap(null);
      searchMarkerRef.current = new kakao.maps.Marker({
        position: center,
        map: mapObjRef.current,
      });
      // (선택) 작은 인포윈도우 라벨
      const iw = new kakao.maps.InfoWindow({
        content: `<div style="padding:4px 6px;font-size:11px;color:#111;border-radius:6px;border:1px solid #e5e7eb;background:#fff;">검색 위치</div>`,
        removable: false,
      });
      iw.open(mapObjRef.current, searchMarkerRef.current);
      // 이전 라벨 닫는 용도로 infoRef에 추가
      infoRef.current.push(iw);
      // 너무 많아지지 않게 1개 유지
      if (infoRef.current.length > 1) {
        const old = infoRef.current.shift();
        old.close();
      }
    });
  }, [regionToken]);

  /* 4) 마커는 filtered가 바뀔 때만 다시 그림 (더미 좌표 그대로 사용) */
  useEffect(() => {
    const map = mapObjRef.current;
    const kakao = window.kakao;
    if (!map || !kakao) return;

    // 기존 마커/인포윈도우 제거 (검색 위치 마커는 유지)
    infoRef.current.forEach((iw) => iw.close());
    infoRef.current = [];
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new kakao.maps.LatLngBounds();

    filtered.forEach((s) => {
      const pos = new kakao.maps.LatLng(s.lat, s.lng);
      const marker = new kakao.maps.Marker({ position: pos });
      const iw = new kakao.maps.InfoWindow({
        content: `
          <div style="display:flex;gap:8px;align-items:center;padding:6px 8px;white-space:nowrap;">
            <img src="${s.image}" style="width:42px;height:28px;object-fit:cover;border-radius:6px;border:1px solid #eee" />
            <div>
              <div style="font-weight:600;font-size:12px;">${s.name}</div>
              <div style="color:#6b7280;font-size:11px;">${s.category}</div>
            </div>
          </div>
        `,
      });
      kakao.maps.event.addListener(marker, "click", () => {
        infoRef.current.forEach((x) => x.close());
        iw.open(map, marker);
      });
      marker.setMap(map);
      markersRef.current.push(marker);
      infoRef.current.push(iw);
      bounds.extend(pos);
    });

    // (선택) 마커가 있으면 경계 맞춤하고 싶으면 주석 해제
    // if (filtered.length > 0) map.setBounds(bounds, 40, 40, 40, 40);
  }, [filtered]);

  const onClickStore = (s) => {
    if (mapObjRef.current && window.kakao) {
      const kakao = window.kakao;
      const pos = new kakao.maps.LatLng(s.lat, s.lng);
      mapObjRef.current.panTo(pos);
    }
    navigate(`/similar-stores/${s.id}`, { state: { store: s } });
  };

  return (
    <section className="min-h-screen bg-[#F6F8FB]">
      {/* 상단 네비(간단) */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto w-full max-w-7xl px-5 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black">←</button>
          <nav className="flex-1 flex items-center justify-center gap-10 text-sm text-gray-500">
            <span>아이디어/ 시장성 진단</span>
            <span>비즈니스 설계/ 리스크 진단</span>
            <span className="font-semibold text-gray-900">유사 점포 분석</span>
            <span>사장님 B2B 도우미</span>
          </nav>
        </div>
      </div>

      {/* 검색창 */}
      <div className="mx-auto w-full max-w-7xl px-5 pt-6">
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="ex) 남양주 카페 / 범계 카페"
            className="w-full h-12 rounded-xl border bg-white px-4 pr-12 text-sm outline-none focus:ring-4 focus:ring-blue-100"
          />
          <button
            onClick={onSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full hover:bg-gray-100 grid place-items-center text-gray-500"
            aria-label="검색"
          >
            🔍
          </button>
        </div>
      </div>

      {/* 지도 + 리스트 2열 */}
      <div className="mx-auto w-full max-w-7xl px-5 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 지도 카드 */}
        <div className="bg-white rounded-3xl border shadow-sm p-3">
          <div ref={mapRef} className="h-[360px] rounded-2xl overflow-hidden" />

          {/* 반경 설정 */}
          <div className="mt-3 rounded-2xl bg-gray-100 p-3">
            <div className="text-sm font-semibold text-gray-700 mb-2">범위 재설정 ▾</div>
            <div className="flex items-center gap-8 text-xs text-gray-400 mb-2">
              조사하고 싶은 지역의 범위를 직접 설정해보세요
            </div>
            <div className="flex items-center gap-8">
              <Chip active={radius === 500}  onClick={() => setRadius(500)}>500m</Chip>
              <Chip active={radius === 1000} onClick={() => setRadius(1000)}>1km</Chip>
              <Chip active={radius === 1500} onClick={() => setRadius(1500)}>1.5km</Chip>
            </div>
          </div>
        </div>

        {/* 리스트 카드 — ✅ 검색 실행 후에만 노출 */}
        <div className="bg-white rounded-3xl border shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h3 className="text-base font-semibold text-gray-900">유사 점포 리스트</h3>
            <select
              className="text-xs border rounded-md px-2 py-1"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="relevance">관련도순</option>
              <option value="review">리뷰순</option>
            </select>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {!hasSearched && (
              <div className="p-8 text-sm text-gray-500">검색을 실행하면 결과가 표시됩니다.</div>
            )}

            {hasSearched && filtered.length === 0 && (
              <div className="p-8 text-sm text-gray-500">검색 결과가 없습니다.</div>
            )}

            {hasSearched && filtered.length > 0 && (
              <div className="divide-y">
                {filtered.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onClickStore(s)}
                    className="w-full text-left px-5 py-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex gap-4">
                      <img src={s.image} alt={s.name} className="h-20 w-24 object-cover rounded-lg border" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[15px] font-semibold text-gray-900 truncate">{s.name}</div>
                        <div className="text-xs text-blue-700 mt-0.5">{s.category}</div>
                        <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{s.desc}</div>
                        <div className="text-[11px] text-gray-400 mt-1">리뷰 {s.review}+ • 추천 포인트</div>
                      </div>
                      <div className="self-center">
                        <span className="inline-flex items-center px-3 h-8 rounded-full bg-blue-600 text-white text-xs">
                          점포 분석 보기
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 h-9 rounded-full text-sm border ${
        active ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200"
      }`}
    >
      {children}
    </button>
  );
}
