import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

/** 
 * SimilarStores에서 navigate(`/similar-stores/${s.id}`, { state: { store: s } })
 * 로 넘어오면 state에 store가 들어있고,
 * 직접 URL로 접근했을 때(state 없음)는 아래 Fallback 더미로 메워줍니다.
 */
const FALLBACK_STORES = {
  goodweather: {
    id: "goodweather",
    name: "카페굿웨더 범계",
    category: "카페/디저트",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800",
    desc: "로스터리 & 디저트 강점, 감성 브랜딩",
    review: 683,
    address: "경기 안양시 동안구 ○○로 12 3층",
    phone: "0507-1234-5678",
    hours: "12:00 ~ 22:00 (라스트오더 21:30)",
  },
  butterb: {
    id: "butterb",
    name: "버터비버 범계본점",
    category: "카페/디저트",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800",
    desc: "수제 베이커리, 테이크아웃 수요↑",
    review: 992,
    address: "경기 안양시 동안구 △△로 7",
    phone: "0507-9876-5432",
    hours: "10:30 ~ 21:00",
  },
  orosea: {
    id: "orosea",
    name: "오르세커피",
    category: "아메리카노·쿠폰",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800",
    desc: "싱글오리진 위주, 가성비 메뉴",
    review: 412,
    address: "경기 안양시 동안구 ◇◇길 22",
    phone: "0507-1350-4366",
    hours: "11:00 ~ 23:00",
  },
};

export default function StoreDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const stateStore = useLocation().state?.store;

  const store = stateStore ?? FALLBACK_STORES[id];

  if (!store) {
    return (
      <section className="min-h-screen bg-[#F6F8FB]">
        <div className="mx-auto max-w-5xl px-5 py-10">
          <div className="bg-white border rounded-2xl p-6 text-center">
            <h1 className="text-xl font-bold">점포 정보를 찾을 수 없어요</h1>
            <p className="mt-2 text-sm text-gray-500">
              목록에서 다시 선택해 주세요.
            </p>
            <button
              onClick={() => navigate("/similar-stores")}
              className="mt-6 inline-flex items-center justify-center px-4 h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              ← 유사 점포 리스트로
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F6F8FB]">
      {/* 상단 바 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto w-full max-w-5xl px-5 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black">←</button>
          <span className="text-sm text-gray-500">유사 점포 분석</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="bg-white rounded-3xl border shadow-sm p-6">
          {/* 헤더 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{store.name}</h1>
              <div className="mt-1 text-blue-700 text-sm">{store.category}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 h-8 rounded-full bg-emerald-50 text-emerald-700 text-xs border border-emerald-200">
                리뷰 {store.review}+
              </span>
              <button
                className="inline-flex items-center justify-center px-4 h-9 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700"
                onClick={() => alert("찜(더미). API 연결 시 서버로 즐겨찾기 저장")}
              >
                ♥ 찜
              </button>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
            <img
              src={store.image}
              alt={store.name}
              className="h-[180px] w-full md:w-[260px] object-cover rounded-xl border"
            />
            <div className="text-sm space-y-2">
              <div>📍 주소: {store.address}</div>
              <div>🕒 영업시간: {store.hours}</div>
              <div>📞 연락처: {store.phone}</div>
              <div className="text-gray-500">소개: {store.desc}</div>
            </div>
          </div>

          <div className="h-px bg-gray-200 my-6" />

          {/* 경쟁력 분석 요약 (더미) */}
          <h2 className="text-lg font-semibold">경쟁력 분석 요약</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border p-4">
              <div className="font-semibold text-gray-800 mb-2">🔹 강점</div>
              <ul className="text-sm text-gray-800 space-y-1 list-disc pl-5">
                <li>브랜딩/공간 경쟁력</li>
                <li>디저트 품목 퀄리티</li>
                <li>회전형 테이크아웃 수요</li>
              </ul>
            </div>
            <div className="rounded-xl border p-4">
              <div className="font-semibold text-gray-800 mb-2">🔻 약점</div>
              <ul className="text-sm text-gray-800 space-y-1 list-disc pl-5">
                <li>접근성 이슈(층고/엘리베이터)</li>
                <li>주변 경쟁 브랜드 다수</li>
                <li>가격 포지션 상향</li>
              </ul>
            </div>
            <div className="rounded-xl border p-4 bg-amber-50">
              <div className="font-semibold text-gray-800 mb-2">🤖 요약 코멘트</div>
              <p className="text-sm text-gray-800">
                핵심 타깃에 맞춘 공간/메뉴 전략은 강점입니다. 접근성/가격 이슈를 보완하면 재방문율을 더 끌어올릴 수 있어요.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => navigate("/similar-stores")}
              className="inline-flex items-center justify-center px-4 h-10 rounded-lg border text-sm hover:bg-gray-50"
            >
              ← 목록으로
            </button>
            <button
              onClick={() => alert("시장성 분석 페이지로 이동(나중에 연결)")}
              className="inline-flex items-center justify-center px-4 h-10 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              시장성 분석 보기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
