// src/pages/SimilarStores.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/** 배포 시 nginx 프록시를 쓰면 빈 문자열("")로 두고, 개발 중 EC2 직접 호출 시 IP를 넣으세요. */
const API_BASE = import.meta.env.VITE_API_BASE || "http://3.36.114.249:8080";

/* ── Kakao SDK 로더 (services 포함: 지오코딩/키워드검색) ── */
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

/** 입력을 “지역, 키워드”로 파싱 */
function parseSearch(raw) {
  const s = (raw || "").trim();
  if (!s) return { region: "", keyword: "" };
  const parts = s.split(",").map((x) => x.trim()).filter(Boolean);
  if (parts.length === 1) return { region: parts[0], keyword: "카페" };
  return { region: parts[0], keyword: parts.slice(1).join(" ") || "카페" };
}

/** 서버 응답 → UI용 아이템 매핑 */
function mapPlace(p) {
  // swagger 예시 필드:
  // id, place_name, category_group_code, category_name, phone,
  // address_name, road_address_name, x(lng), y(lat), place_url
  const lat = parseFloat(p.y);
  const lng = parseFloat(p.x);
  return {
    id: p.id || `${p.x},${p.y}`,
    name: p.place_name || "이름 없음",
    category: p.category_name || "",
    phone: p.phone || "",
    address: p.road_address_name || p.address_name || "",
    lat: Number.isFinite(lat) ? lat : undefined,
    lng: Number.isFinite(lng) ? lng : undefined,
    place_url: p.place_url || "",
    image:
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=800&auto=format&fit=crop", // placeholder
  };
}

export default function SimilarStores() {
  const navigate = useNavigate();
  const appKey = import.meta.env.VITE_KAKAO_MAP_KEY;

  // refs
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const markersRef = useRef([]);       // 결과 마커
  const labelRef = useRef([]);         // 결과 인포윈도우(라벨)
  const circleRef = useRef(null);
  const searchMarkerRef = useRef(null); // 검색 기준 위치 마커

  // 검색 상태
  const [input, setInput] = useState("범계, 카페");
  const [committed, setCommitted] = useState(""); // 실제 실행된 검색어
  const [hasSearched, setHasSearched] = useState(false);
  const [radius, setRadius] = useState(1000);
  const [sort, setSort] = useState("relevance"); // relevance | review(더미)
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [results, setResults] = useState([]); // API 결과
  const [center, setCenter] = useState(null); // {lat, lng}

  const { region, keyword } = useMemo(() => parseSearch(committed), [committed]);

  // 1) 지도 초기화
  useEffect(() => {
    let cleanup = () => {};
    (async () => {
      const kakao = await loadKakaoSdk(appKey);
      if (!mapRef.current) return;
      const defCenter = new kakao.maps.LatLng(37.3895, 126.9525);
      const map = new kakao.maps.Map(mapRef.current, { center: defCenter, level: 4 });
      mapObjRef.current = map;

      const circle = new kakao.maps.Circle({
        center: defCenter,
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
        labelRef.current.forEach((iw) => iw.close());
        markersRef.current.forEach((m) => m.setMap(null));
        if (searchMarkerRef.current) searchMarkerRef.current.setMap(null);
        labelRef.current = [];
        markersRef.current = [];
        searchMarkerRef.current = null;
      };
    })();
    return () => cleanup();
  }, [appKey]);

  // 2) 반경 바꾸면 원 반경만 갱신 + 이미 검색한 상태면 재검색
  useEffect(() => {
    if (circleRef.current) circleRef.current.setRadius(radius);
    if (hasSearched && center) {
      void fetchAndRender(center.lat, center.lng, keyword, radius);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radius]);

  // 3) 검색 실행
  const onSearch = () => {
    const q = input.trim();
    if (!q) return;
    setCommitted(q);
    setHasSearched(true);
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch();
    }
  };

  // 4) committed 변경 → 지오코딩으로 중심 좌표, 원/마커 이동 → API 호출
  useEffect(() => {
    (async () => {
      if (!mapObjRef.current || !window.kakao || !region) return;
      const kakao = window.kakao;
      const ps = new kakao.maps.services.Places();

      ps.keywordSearch(region, async (data, status) => {
        if (status !== kakao.maps.services.Status.OK || !data.length) return;
        const { y, x } = data[0]; // y: lat, x: lng
        const lat = parseFloat(y);
        const lng = parseFloat(x);
        const centerLatLng = new kakao.maps.LatLng(lat, lng);

        // 지도/원 이동
        mapObjRef.current.setCenter(centerLatLng);
        mapObjRef.current.setLevel(4);
        if (circleRef.current) circleRef.current.setPosition(centerLatLng);

        // 검색 기준 마커
        if (searchMarkerRef.current) searchMarkerRef.current.setMap(null);
        searchMarkerRef.current = new kakao.maps.Marker({
          position: centerLatLng,
          map: mapObjRef.current,
        });
        setCenter({ lat, lng });

        await fetchAndRender(lat, lng, keyword, radius);
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committed]);

  // 5) API 호출 + 지도에 결과 그리기
  const fetchAndRender = async (lat, lng, q, r) => {
    setLoading(true);
    setErr("");

    try {
      const url = `${API_BASE}/api/kakao/keyword/all`;
      const { data } = await axios.get(url, {
        params: { lat, lng, q, radius: r },
      });

      const items = Array.isArray(data) ? data.map(mapPlace) : [];
      setResults(items);

      // 지도 마커/라벨 초기화
      labelRef.current.forEach((iw) => iw.close());
      labelRef.current = [];
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      if (!mapObjRef.current || !window.kakao) return;
      const kakao = window.kakao;
      const map = mapObjRef.current;

      items.forEach((s) => {
        if (!(Number.isFinite(s.lat) && Number.isFinite(s.lng))) return;
        const pos = new kakao.maps.LatLng(s.lat, s.lng);
        const marker = new kakao.maps.Marker({ position: pos });
        const iw = new kakao.maps.InfoWindow({
          content: `
            <div style="display:flex;gap:8px;align-items:center;padding:6px 8px;white-space:nowrap;">
              <div style="font-weight:600;font-size:12px;">${s.name}</div>
            </div>
          `,
        });
        kakao.maps.event.addListener(marker, "click", () => {
          labelRef.current.forEach((x) => x.close());
          iw.open(map, marker);
        });
        marker.setMap(map);
        markersRef.current.push(marker);
        labelRef.current.push(iw);
      });
    } catch (e) {
      setErr(
        typeof e?.response?.data === "string"
          ? e.response.data
          : e?.message || "API 요청 실패"
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 리스트 정렬(서버가 관련도 제공 안 하면 간단 정렬만)
  const sortedResults = useMemo(() => {
    const arr = [...results];
    if (sort === "review") {
      // 리뷰 데이터가 없으므로 이름 역알파 정렬 예시(임시)
      arr.sort((a, b) => (a.name < b.name ? 1 : -1));
    }
    return arr;
  }, [results, sort]);

  const onClickStore = (s) => {
    if (mapObjRef.current && window.kakao && Number.isFinite(s.lat) && Number.isFinite(s.lng)) {
      const kakao = window.kakao;
      const pos = new kakao.maps.LatLng(s.lat, s.lng);
      mapObjRef.current.panTo(pos);
    }
    navigate(`/similar-stores/${s.id}`, { state: { store: s, radius } });
  };

  return (
    <section className="min-h-screen bg-[#F6F8FB]">
      {/* 검색창 */}
      <div className="mx-auto w-full max-w-7xl px-5 pt-6">
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder='예) "범계, 카페" 또는 "남양주, 빵집"'
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
            <div className="flex items-center gap-8">
              <Chip active={radius === 500} onClick={() => setRadius(500)}>500m</Chip>
              <Chip active={radius === 1000} onClick={() => setRadius(1000)}>1km</Chip>
              <Chip active={radius === 1500} onClick={() => setRadius(1500)}>1.5km</Chip>
            </div>
          </div>
        </div>

        {/* 리스트 카드 */}
        <div className="bg-white rounded-3xl border shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h3 className="text-base font-semibold text-gray-900">
              유사 점포 리스트 {hasSearched && !loading ? `(${results.length}곳)` : ""}
            </h3>
            <select
              className="text-xs border rounded-md px-2 py-1"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="relevance">관련도순</option>
              <option value="review">이름(임시)순</option>
            </select>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {!hasSearched && (
              <div className="p-8 text-sm text-gray-500">검색을 실행하면 결과가 표시됩니다.</div>
            )}

            {hasSearched && loading && (
              <div className="p-8 text-sm text-gray-500">불러오는 중…</div>
            )}

            {hasSearched && !loading && err && (
              <div className="p-8 text-sm text-red-600 whitespace-pre-wrap">{err}</div>
            )}

            {hasSearched && !loading && !err && sortedResults.length === 0 && (
              <div className="p-8 text-sm text-gray-500">결과가 없습니다.</div>
            )}

            {hasSearched && !loading && !err && sortedResults.length > 0 && (
              <div className="divide-y">
                {sortedResults.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onClickStore(s)}
                    className="w-full text-left px-5 py-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex gap-4">
                      <img
                        src={s.image}
                        alt={s.name}
                        className="h-20 w-24 object-cover rounded-lg border"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[15px] font-semibold text-gray-900 truncate">
                          {s.name}
                        </div>
                        <div className="text-xs text-blue-700 mt-0.5">
                          {s.category}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {s.address}
                        </div>
                        {s.phone && (
                          <div className="text-[11px] text-gray-400 mt-1">{s.phone}</div>
                        )}
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
