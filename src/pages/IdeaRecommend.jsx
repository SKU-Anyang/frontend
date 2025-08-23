import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../assets/search.png";   // 상단 돋보기 이미지
import searchIcon2 from "../assets/search2.png"; // 버튼 안 돋보기 이미지

export default function IdeaRecommend() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/idea-results?query=${encodeURIComponent(q)}`);
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-100 via-white to-blue-100" />

      {/* ── 콘텐츠: '텍스트 블록'을 정확히 화면 중앙에 ── */}
      {/* 헤더가 나중에 들어오면 min-h를 calc로 바꿔 쓰면 됨:
          min-h-[calc(100vh-84px)] */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 md:px-8 min-h-screen flex items-center justify-center">
        {/* 텍스트를 기준으로 위/아래 요소 배치 */}
        <div className="w-full max-w-3xl text-center flex flex-col items-center">
          {/* 텍스트 위: 상단 돋보기 (텍스트를 기준으로 간격) */}
          <img
            src={searchIcon}
            alt="돋보기"
            className="h-16 w-16 md:h-20 md:w-20 object-contain select-none mb-6 md:mb-8"
            draggable={false}
          />

          {/* 텍스트(기준점) */}
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              아이디어 추천
            </h1>
            <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-500">
              관심 지역과 업종을 입력하면 한줄 창업 아이디어를 제공해드려요
            </p>
          </div>

          {/* 텍스트 아래: 검색 인풋 (텍스트 기준으로 간격) */}
          <form onSubmit={onSubmit} className="w-full mt-8 md:mt-10">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ex) 범계, 카페"
                className="w-full h-14 md:h-16 rounded-full border border-gray-200 bg-white/90 shadow-sm px-6 pr-16 text-base md:text-lg placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300"
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
        </div>
      </div>
    </section>
  );
}
