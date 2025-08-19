// src/components/MainSection.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 배경/왼쪽 아이콘
import teamworkImage from "../assets/teamwork.jpg";
import ideaIcon from "../assets/idea.png";

// Feature strip 이미지
import designImg from "../assets/design.png";
import analysisImg from "../assets/analysis.png";
import b2bImg from "../assets/b2b.png";
import curationImg from "../assets/curation.png";

import pins from "../assets/pins.png"; // 핀 묶음 이미지(한 장)

export default function MainSection() {
  return (
    <main className="w-full">
      {/* Hero */}
      <section className="relative w-full h-[420px] md:h-[500px] overflow-hidden">
        {/* 배경 */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${teamworkImage})` }}
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* 콘텐츠 */}
        <div className="relative z-10 h-full mx-auto max-w-screen-xl px-5 md:px-8 flex justify-between items-start pt-12">
          {/* 왼쪽: 문구 + 전구 아이콘 */}
          <div className="text-white flex items-center gap-4 self-end mb-16 md:mb-24 -translate-x-2 md:-translate-x-6">
            <div>
              <h1 className="text-2xl md:text-[40px] font-extrabold leading-tight drop-shadow-sm">
                성공하는 창업,<br />이제 데이터로 시작하세요
              </h1>
              <p className="mt-4 text-sm md:text-base opacity-90">
                막연한 감 대신, 실제 데이터를 기반으로
              </p>
            </div>
            <img
              src={ideaIcon}
              alt="아이디어 아이콘"
              className="w-20 h-20 md:w-28 md:h-28 object-contain"
            />
          </div>

          <div
  className="relative bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] rounded-[30px] p-7 mt-32 ml-auto mr-[-200px] shrink-0"
  style={{ width: "700px", height: "300px" }}
>


<div className="pl-[72px] pr-[200px]">
  {/* 라벨 */}
  <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 mb-3">
    <span className="font-semibold">이벤트</span>
  </div>

  {/* 제목 */}
  <h2 className="text-[22px] md:text-[27px] font-extrabold leading-tight">
    AI가 분석한 2025년<br />안양에서 가장 유망한 창업 지역은?
  </h2>

  {/* 설명 */}
  <p className="mt-5 text-sm md:text-base text-gray-600 leading-relaxed">
    첨부된 맵을 확인하거나, 당신이 생각하는 HOT PLACE를 작성해 주세요.
  </p>
</div>


  {/* 핀 이미지 */}
  <img
    src={pins}
    alt="pins"
    className="absolute top-1/2 -translate-y-1/2 right-[76px] w-[120px] h-auto object-contain select-none pointer-events-none"
    draggable={false}
  />

  {/* 왼쪽 화살표 */}
  <button
    aria-label="prev"
    className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white border border-black/10 shadow hover:bg-black/5 z-10"
  >
    <ChevronLeft size={20} className="text-gray-700" />
  </button>

  {/* 오른쪽 화살표 */}
  <button
    aria-label="next"
    className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white border border-black/10 shadow hover:bg-black/5 z-10"
  >
    <ChevronRight size={20} className="text-gray-700" />
  </button>

  {/* 인디케이터 */}
  <div className="absolute left-6 bottom-6 flex items-center gap-2">
    <span className="h-1.5 w-6 rounded-full bg-gray-900" />
    <span className="h-1.5 w-2 rounded-full bg-gray-300" />
  </div>
</div>


        </div>
      </section>

      {/* Feature strip */}
      <section className="w-full bg-white">
        <div className="max-w-screen-xl mx-auto px-5 md:px-8">
          <div className="mt-16" />
          <div className="rounded-[24px] border-2 bg-white shadow-[0_10px_22px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="flex flex-row flex-nowrap w-full items-stretch divide-x divide-gray-300/70">
              <FeatureCell img={designImg} text="비즈니스 설계/ 리스크 진단" />
              <FeatureCell img={analysisImg} text="유사 점포 분석" />
              <FeatureCell img={b2bImg} text="사장님 B2B 도우미" />
              <FeatureCell img={curationImg} text="사용자 큐레이션" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ===== 보조 컴포넌트 ===== */
function FeatureCell({ img, text }) {
  return (
    <div className="flex-1 basis-0 min-w-0 px-10 py-10 flex flex-col items-center justify-center text-center">
      <img
        className="h-20 w-20 md:h-20 md:w-20 object-contain mb-4 shrink-0"
        src={img}
        alt={text}
      />
      <p className="text-[18px] md:text-[20px] font-semibold text-gray-900 leading-tight">
        {text}
      </p>
    </div>
  );
}
