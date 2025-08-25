import { Link } from "react-router-dom";

/* Section1 — 100% 배율용 축소 버전 (Scroll 수정) */
export function Section1() {
  return (
    <section
      className="relative flex items-center justify-center min-h-[100vh] py-24"
      style={{ background: "radial-gradient(circle, #F9FAF8 0%, #C8D2DD 100%)" }}
    >
      {/* 중앙 컨테이너 */}
      <div className="mx-auto w-[92%] max-w-[960px] flex flex-col items-center text-center">
        <div className="w-[140px] h-[140px] mb-8">
          <img src="/AI.png" alt="AI Helper" className="w-full h-full object-contain" />
        </div>

        <h1 className="text-[22px] md:text-[26px] font-extrabold text-slate-800 leading-snug">
          자신이 원하는 지역에 딱 맞는 창업, AI가 알려줍니다
        </h1>

        <p className="mt-3 text-[15px] md:text-[16px] font-semibold text-[#3E6BCE]">
          상권 분석부터 폐업 예측까지, 완전한 창업 설계 도우미
        </p>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-[365px] h-[52px] rounded-2xl text-white text-[18px] font-extrabold shadow-md hover:opacity-95 active:translate-y-[1px]"
            style={{ backgroundColor: "#7895CB" }}
          >
            STARTIN 지금 바로 시작하기
          </Link>
        </div>

        <Link
          to="/signup"
          className="mt-3 text-[13px] text-slate-500 hover:text-slate-600 underline underline-offset-4"
        >
          회원가입
        </Link>
      </div>

      {/* Scroll */}
      <div className="absolute inset-x-0 bottom-6">
        <div className="mx-auto w-[92%] max-w-[960px] flex flex-col items-center select-none">
          <span className="text-[15px] font-semibold text-gray-500 opacity-80">
            Scroll
          </span>
          <svg
            className="w-5 h-5 mt-1 text-gray-500 opacity-80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              d="M6 9l6 6 6-6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            className="w-5 h-5 -mt-3 text-gray-500 opacity-80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              d="M6 9l6 6 6-6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

    </section>
  );
}

/* Section2 — 카드 크기 그대로, 아이콘 오른쪽 상단 고정 + 파란 텍스트 크기 ↑ */
export function Section2() {
  return (
    <section className="relative w-full min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 w-full min-h-screen flex flex-col items-center">
        {/* 타이틀 */}
        <h2 className="mt-8 text-center text-white mb-8 tracking-wide">
          <span className="text-[1rem] font-bold">STARTIN</span>
          <span className="ml-1 text-[0.95rem] font-medium">의 방향성</span>
        </h2>

        {/* 카드 3열 */}
        <div className="flex-1 w-full flex items-center justify-center px-4">
          <div className="mx-auto w-[92%] max-w-[1100px] grid grid-cols-3 gap-12">
            
            {/* 실행 중심 */}
            <div className="relative bg-white rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] p-6 min-h-[200px]">
              <img
                src="/focus.png"
                alt="실행 중심"
                className="absolute top-4 right-4 w-16 h-16 object-contain pointer-events-none select-none"
              />
              <div className="mt-6 pr-3">
                <h3 className="text-[26px] font-extrabold tracking-tight text-[#1A4CB3]">
                  실행 중심
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-gray-900 font-semibold">
                  아이디어→실행→운영까지<br />모든 과정을 함께 합니다
                </p>
              </div>
            </div>

            {/* 데이터 기반 */}
            <div className="relative bg-white rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] p-6 min-h-[200px]">
              <img
                src="/data.png"
                alt="데이터 기반"
                className="absolute top-4 right-4 w-16 h-16 object-contain pointer-events-none select-none"
              />
              <div className="mt-6 pr-1">
                <h3 className="text-[26px] font-extrabold tracking-tight text-[#1A4CB3]">
                  데이터 기반
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-gray-900 font-semibold">
                  상권 + 폐업률 + 유사 점포<br />정보 등을 데이터 기반으로 제공합니다
                </p>
              </div>
            </div>

            {/* 현장 밀착 */}
            <div className="relative bg-white rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] p-6 min-h-[200px]">
              <img
                src="/Where.png"
                alt="현장 밀착"
                className="absolute top-4 right-4 w-16 h-16 object-contain pointer-events-none select-none"
              />
              <div className="mt-6 pr-3">
                <h3 className="text-[26px] font-extrabold tracking-tight text-[#1A4CB3]">
                  현장 밀착
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-gray-900 font-semibold">
                  사용자 위치·유형에 맞춤<br />분석 및 대응을 도와줍니다
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}


/* ✅ Section3.jsx */
export function Section3() {
  return (
    <section className="bg-gray-100 py-24 md:py-36">
      <div className="mx-auto w-[92%] sm:w-[86%] lg:w-[76%] space-y-40">
        
        {/* ✅ Section 타이틀 */}
        <div className="text-center">
          <p className="text-[#1A4CB3] font-bold text-[16px] md:text-[18px] mb-10">
            어떤 서비스인가요?
          </p>
        </div>

        {/* ✅ 카드 블록 */}
        <div className="text-center">
          <h2 className="text-[20px] md:text-[26px] font-bold leading-snug">
            사용자에게{" "}
            <span className="text-[#2563EB]">한줄 창업 아이디어 추천</span>과
            <br />
            <span className="text-[#2563EB]">시장성을 자동으로 진단</span> 해 드려요
          </h2>

          <div
            className="mt-14 bg-white rounded-[20px] shadow-md 
                       p-12 flex flex-row items-center justify-between gap-16
                       min-h-[320px]"
          >
            {/* 검색 */}
            <div className="flex-1 flex flex-col items-center text-center">
              <img
                src="/search.png"
                alt="아이디어 추천"
                className="w-10 h-10 mb-3 mx-auto"
              />
              <p className="font-semibold text-black mb-3">
                아이디어 추천
              </p>
              <div className="relative w-[300px] md:w-[400px] mx-auto">
                <input
                  type="text"
                  placeholder="(ex) 범계, 카페"
                  className="w-full h-10 rounded-full border border-gray-300
                             pl-4 pr-10 text-sm text-gray-700 placeholder-gray-400
                             focus:outline-none focus:border-[#1A4CB3]"
                />
              </div>
            </div>

            {/* 차트 이미지 */}
            <div className="flex-1 flex justify-center">
              <img
                src="/chart.png"
                alt="그래프"
                className="w-[420px] md:w-[560px] h-auto"
              />
            </div>
          </div>
        </div>

        {/* ✅ 2) 비즈니스 구성, 유사 점포 분석 */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 px-6 md:px-20 items-start">
            {/* 왼쪽 */}
            <div className="text-left">
              <h3 className="text-[22px] md:text-[26px] font-extrabold leading-snug">
                <span className="text-[#2563EB]">비즈니스 구성</span>
                <span className="text-[17px] md:text-[19px] text-black font-bold">과</span>
                <br />
                <span className="text-[#2563EB]">폐업 리스크 분석까지</span>
                <span className="text-[17px] md:text-[19px] text-black font-bold">
                  체계적인 창업을 위해 도와드려요
                </span>
              </h3>
            </div>

            {/* 오른쪽 */}
            <div className="text-right -mt-12">
              <h3 className="text-[22px] md:text-[26px] font-extrabold leading-snug">
                <span className="text-[#2563EB]">유사 점포 분석</span>
                <span className="text-[17px] md:text-[19px] text-black font-bold">
                  으로 더욱 구체화된 서비스를 제공합니다
                </span>
              </h3>
            </div>
          </div>

          {/* 카드 + 카페 이미지 */}
          <div className="relative w-full">
            <img
              src="/business_card.png"
              alt="비즈니스 구성 배경"
              className="w-full h-auto object-contain rounded-[32px]"
            />
            <img
              src="/cafe.png"
              alt="카페굿웨더"
              className="absolute top-[80%] -translate-y-1/2 right-[3%]
                        w-[38%] md:w-[32%] h-auto object-contain"
            />
          </div>
        </div>

        {/* ✅ 3) B2B 사장님 도우미, 사용자 반응 기반 큐레이션 */}
        <div className="!text-left">
          {/* 제목 2열 */}
          <div className="grid grid-cols-2 gap-6 mb-10 px-6 md:px-20">
            <div className="text-left">
              <h3 className="text-[20px] md:text-[22px] font-extrabold leading-snug">
                <span className="text-[#2563EB]">B2B사장님 도우미</span>
              </h3>
              <p className="mt-3 text-[17px] md:text-[19px] text-black font-bold">
                기능을 이용해 자신만의 창업을 이어나가 보세요
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-[20px] md:text-[22px] font-extrabold leading-snug">
                <span className="text-[#2563EB]">사용자 반응 기반 큐레이션</span>
                <span className="text-[17px] md:text-[19px] text-black font-bold">으로</span>
              </h3>
              <p className="mt-3 text-[17px] md:text-[19px] text-black font-bold">
                맞춤형 창업 아이디어나 정보를 드려요
              </p>
            </div>
          </div>

          {/* 흰색 큰 박스 */}
          <div className="w-full bg-white rounded-[22px] shadow-[0_6px_18px_rgba(0,0,0,0.10)] border border-gray-100 py-10 px-16 md:px-24">
            {/* 좌우 정렬 + 여백 */}
            <div className="flex justify-between items-start gap-10">
              
              {/* 왼쪽: 도우미 */}
              <div className="w-[44%]">
                <div className="flex flex-col items-center sm:items-start mt-8"> 
                  <div className="mb-6">
                    <img src="/alien.png" alt="도우미" className="w-10 h-10 object-contain" />
                  </div>

                  <div className="w-full max-w-[420px] bg-gray-100 rounded-lg p-1 flex gap-1">
                    <button className="flex-1 h-9 rounded-md bg-white text-gray-800 text-[12px] font-medium shadow-sm">
                      운영 전략
                    </button>
                    <button className="flex-1 h-9 rounded-md text-gray-700 text-[12px] font-medium">
                      SNS 글쓰기 도우미
                    </button>
                    <button className="flex-1 h-9 rounded-md text-gray-700 text-[12px] font-medium">
                      고객 응대
                    </button>
                  </div>
                </div>
              </div>


              {/* 오른쪽: 북카페 */}
              <div className="w-[44%] flex justify-end">
                <div className="relative w-full max-w-[520px]">
                  {/* 이미지 */}
                  <img
                    src="/bookcafe.png"
                    alt="북카페 + 작가의 방"
                    className="w-full h-auto object-contain"
                  />

                  {/* 이미지 위 텍스트 */}
                  <div className="absolute top-[70px] left-6 right-6">
                    <ul className="list-disc list-inside space-y-1 text-[12px] md:text-[15px] text-gray-800">
                      <li>핵심 콘셉트: 작가가 되고 싶은 20대를 위한 감성 독립서점+카페</li>
                      <li>주 타깃: 대학생, 프리랜서, 감성 소비자</li>
                      <li>운영: 독립출판사 전시·판매, 글쓰기 모임·워크숍</li>
                      <li>포인트: 카페를 ‘의미 있는 공간’으로 소비하고 싶어하는 수요 공략</li>
                    </ul>
                  </div>

                  {/* 하단 휴지통 아이콘 (하트 옆 위치) */}
                  <div className="absolute bottom-2 right-14">
                    <img
                      src="/trash.png"
                      alt="삭제"
                      className="w-6 h-7 object-contain"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}



/* Section4 — 살짝 확장 + 텍스트/이미지 키움 */
export function Section4() {
  return (
    <section
      className="
        flex flex-col items-center justify-center text-center
        px-4
        py-44 md:py-60
      "
      style={{
        background: "radial-gradient(circle, #F9FAF8 0%, #A0AEC0 100%)",
      }}
    >
      <div className="mt-10 text-lg md:text-xl font-semibold leading-relaxed text-black">
        <p>창업 이전부터, 창업 이후까지</p>
        <p>내 지역에 최적화된 창업을 AI가 설계하고,</p>
        <p>실패도 피하게 해주는</p>
        <p>풀 패키지 창업 AI 서비스</p>
      </div>

      <img
        src="/logo_black.png"
        alt="로고"
        className="mt-16 w-32 md:w-40"
      />
    </section>
  );
}




/* 하나의 Screen 컴포넌트에서 1~4 순서대로 */
export default function Screen() {
  return (
    <>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
    </>
  );
}
