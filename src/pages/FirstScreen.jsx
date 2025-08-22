import { Link } from "react-router-dom";

/* Section1 */
export function Section1() {
  return (
    <section
      className="relative flex min-h-screen py-16 md:py-24"
      style={{ background: "radial-gradient(circle, #F9FAF8 0%, #C8D2DD 100%)" }}
    >
      <div className="mx-auto w-[88%] sm:w-[80%] lg:w-[70%] flex flex-col items-center justify-center text-center">
        <div className="w-76 h-76 sm:w-84 sm:h-84 mb-12">
          <img src="/AI.png" alt="AI Helper" className="w-full h-full object-contain" />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-[48px] font-black tracking-[-0.02em] text-slate-800 leading-snug">
          자신이 원하는 지역에 딱 맞는 창업, AI가 알려줍니다
        </h1>

        <p className="mt-5 text-lg sm:text-xl md:text-[28px] font-semibold text-[#3E6BCE]">
          상권 분석부터 폐업 예측까지, 완전한 창업 설계 도우미
        </p>

        {/* 버튼 → mainscreen으로 이동 */}
        <div className="mt-20">
          <Link
            to="/mainscreen"
            className="inline-flex items-center justify-center w-[640px] sm:w-[700px] h-[96px] rounded-3xl text-white text-4xl font-extrabold shadow-xl transition-colors"
            style={{ backgroundColor: "#7895CB" }}
          >
            STARTIN 지금 바로 시작하기
          </Link>
        </div>

        {/* 회원가입 → /signup 이동 */}
        <Link
          to="/SignUp"
          className="mt-7 text-base sm:text-lg md:text-xl text-slate-500 hover:text-slate-600 underline underline-offset-4"
        >
          회원가입
        </Link>
      </div>

      {/* Scroll */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 sm:bottom-10 flex flex-col items-center select-none">
        <span className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-500 opacity-80 tracking-wide">
          Scroll
        </span>
        <img src="/arrow_left.png" alt="" className="w-8 h-8 -rotate-90 opacity-80 mt-2" aria-hidden="true" />
        <img src="/arrow_left.png" alt="" className="w-8 h-8 -rotate-90 opacity-80 -mt-1" aria-hidden="true" />
      </div>
    </section>
  );
}

/* Section2 */
export function Section2() {
  return (
    <section className="relative w-full min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 w-full min-h-screen flex flex-col items-center">
        <h2 className="mt-28 text-center text-white mb-10 tracking-wide">
          <span className="text-[1.6rem] md:text-[2rem] font-bold">STARTIN</span>
          <span className="text-[1.3rem] md:text-[1.7rem] font-medium">의 방향성</span>
        </h2>

        {/* 카드 3 */}
        <div className="flex-1 w-full flex items-center justify-center px-4 md:px-8">
          <div
            className="w-[94%] md:w-[90%] lg:w-[82%]
                       grid grid-cols-1 md:grid-cols-3
                       gap-y-8 md:gap-y-0 gap-x-16"
          >
            {/* 실행 중심 */}
            <div className="bg-white rounded-[48px] shadow-[0_12px_40px_rgba(0,0,0,0.15)]
                            p-16 min-h-[460px] flex flex-col">
              <div className="flex justify-between items-start w-full mt-6">
                <h3 className="text-[52px] md:text-[58px] font-extrabold text-[#1A4CB3]">실행 중심</h3>
                <img src="/focus.png" alt="실행 중심" className="w-36 h-36 md:w-40 md:h-40 object-contain" />
              </div>
              <p className="mt-1 text-[26px] md:text-[30px] leading-[2.8rem] text-gray-900 font-semibold">
                아이디어→실행→운영까지<br />모든 과정을 함께 합니다
              </p>
            </div>

            {/* 데이터 기반 */}
            <div className="bg-white rounded-[48px] shadow-[0_12px_40px_rgba(0,0,0,0.15)]
                            p-16 min-h-[460px] flex flex-col">
              <div className="flex justify-between items-start w-full mt-6">
                <h3 className="text-[52px] md:text-[58px] font-extrabold text-[#1A4CB3]">데이터 기반</h3>
                <img src="/data.png" alt="데이터 기반" className="w-36 h-36 md:w-40 md:h-40 object-contain" />
              </div>
              <p className="mt-1 text-[26px] md:text-[30px] leading-[2.8rem] text-gray-900 font-semibold">
                상권 + 폐업률 + 유사 점포<br />정보 등을 데이터 기반으로 제공합니다
              </p>
            </div>

            {/* 현장 밀착 */}
            <div className="bg-white rounded-[48px] shadow-[0_12px_40px_rgba(0,0,0,0.15)]
                            p-16 min-h-[460px] flex flex-col">
              <div className="flex justify-between items-start w-full mt-6">
                <h3 className="text-[52px] md:text-[58px] font-extrabold text-[#1A4CB3]">현장 밀착</h3>
                <img src="/Where.png" alt="현장 밀착" className="w-36 h-36 md:w-40 md:h-40 object-contain" />
              </div>
              <p className="mt-1 text-[26px] md:text-[30px] leading-[2.8rem] text-gray-900 font-semibold">
                사용자 위치·유형에 맞춤<br />분석 및 대응을 도와줍니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Section3 */
export function Section3() {
  return (
    <section className="bg-white py-60 md:py-96">
      <div className="mx-auto w-[92%] sm:w-[86%] lg:w-[76%] space-y-[240px]">

        {/* 1) 어떤 서비스인가요? */}
        <div>
          <p className="text-center text-[#1A4CB3] font-semibold text-[30px]">
            어떤 서비스인가요?
          </p>
          <h2 className="text-center mt-24 text-[28px] md:text-[34px] font-extrabold leading-snug">
            사용자에게 <span className="text-[#1A4CB3]">한줄 창업 아이디어 추천</span>과
            <br />
            <span className="text-[#1A4CB3]">시장성을 자동으로 진단</span> 해 드려요
          </h2>

          <div className="bg-white rounded-[48px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] mt-12 p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="flex flex-col items-center justify-center text-center">
              <img src="/search.png" alt="아이디어 추천" className="w-16 h-16 mb-5 mx-auto" />
              <p className="font-bold text-xl mb-5">아이디어 추천</p>
              <div className="relative w-[280px] md:w-[400px]">
                <input
                  type="text"
                  placeholder="(ex) 범계, 카페"
                  className="w-full h-12 md:h-14 rounded-full border border-gray-300
                             pl-5 pr-12 text-base text-gray-700 placeholder-gray-400
                             focus:outline-none focus:border-[#1A4CB3]"
                />
                <img
                  src="/search.png"
                  alt="검색"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60 pointer-events-none"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <img
                src="/chart.png"
                alt="그래프"
                className="max-w-[90%] h-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* 2) 비즈니스 구성, 유사 점포 분석 */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-6 px-8 md:px-32">
            {/* 왼쪽 */}
            <div className="justify-self-center md:justify-self-start text-center md:text-left">
              <h3 className="text-[28px] md:text-[32px] font-extrabold leading-snug">
                <span className="text-[#1A4CB3] ml-6 md:ml-70">비즈니스 구성</span>
                <span className="text-black">과</span>
                <br />
                <span className="text-[#1A4CB3]">폐업 리스크 분석까지</span>
                <span className="text-black"> 체계적인 창업을 위해 도와드려요</span>
              </h3>
            </div>

            {/* 오른쪽 */}
            <div className="justify-self-center md:justify-self-end text-center md:text-right">
              <h3 className="text-[28px] md:text-[32px] font-extrabold leading-snug">
                <span className="text-[#1A4CB3]">유사 점포 분석</span>
                <span className="text-black">으로</span>
                <span className="text-black">더욱 구체화된 서비스를 제공합니다</span>
              </h3>
            </div>
          </div>

          <div className="relative w-full">
            <img
              src="/business_card.png"
              alt="비즈니스 구성 배경"
              className="w-full h-auto object-contain rounded-[48px]"
            />
            <img
              src="/cafe.png"
              alt="카페굿웨더"
              className="absolute top-1/2 -translate-y-1/2 right-[6%]
                         w-[40%] md:w-[36%] lg:w-[34%] h-auto object-contain"
            />
          </div>
        </div>

        {/* 3) B2B 사장님 도우미, 사용자 반응 기반 큐레이션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 px-16 md:px-64">
          {/* 왼쪽 */}
          <div className="text-center md:text-left">
            <h3 className="text-[26px] md:text-[30px] font-extrabold text-[#1A4CB3] ml-10 md:ml-50">
              B2B사장님 도우미
            </h3>
            <p className="mt-1 text-[22px] md:text-[28px] font-semibold text-black">
              기능을 이용해 자신만의 창업을 이어나가 보세요
            </p>
          </div>

          {/* 오른쪽 */}
          <div className="text-center md:text-right transform -translate-x-10 md:-translate-x-20">
            <h3 className="text-[26px] md:text-[30px] font-extrabold inline-block transform -translate-x-4 md:-translate-x-6">
              <span className="text-[#1A4CB3]">사용자 반응 기반 큐레이션</span>
              <span className="text-[22px] md:text-[28px] font-semibold text-black">으로</span>
            </h3>
            <p className="mt-1 text-[22px] md:text-[28px] font-semibold text-black">
              맞춤형 창업 아이디어나 정보를 드려요
            </p>
          </div>
        </div>

        {/* 내용 카드 */}
        <div className="bg-white rounded-[48px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-16 md:p-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-start min-h-[500px]">
          {/* 왼쪽 */}
          <div className="flex flex-col items-center w-full mt-16">
            <img src="/alien.png" alt="도우미" className="w-24 h-24 mb-12" />
            <div className="w-full max-w-[720px] bg-gray-100 rounded-[20px] px-6 py-4 flex items-center justify-between gap-6">
              <span className="flex-1 flex items-center justify-center px-5 py-2 bg-white rounded-[12px] border border-gray-200 text-gray-700 text-lg font-semibold">
                운영 전략
              </span>
              <span className="flex-1 flex items-center justify-center text-gray-700 text-lg font-semibold whitespace-nowrap">
                <span className="font-extrabold">SNS</span> 글쓰기 도우미
              </span>
              <span className="flex-1 flex items-center justify-center text-gray-700 text-lg font-semibold">
                고객 응대
              </span>
            </div>
          </div>

          {/* 오른쪽 */}
          <div className="relative w-full">
            <img src="/bookcafe.png" alt="북카페 카드" className="w-[90%] mx-auto" />
            <div className="absolute top-35 left-30 right-6">
              <ul className="list-disc pl-5 space-y-2 text-[20px] text-gray-800 leading-relaxed">
                <li>핵심 콘셉트: 작가가 되고 싶은 20대를 위한 감성 독립서점+카페</li>
                <li>주 타깃: 글쓰는 대학생, 프리랜서, 감성 소비자</li>
                <li>운영: 독립출판사 전시·판매, 글쓰기 모임·워크숍</li>
                <li>포인트: 카페를 ‘의미 있는 공간’으로 소비하고 싶어하는 수요 공략</li>
              </ul>
            </div>
            <div className="absolute bottom-5 right-40">
              <img src="/trash.png" alt="삭제" className="w-12 h-12 mr-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* Section4 */
export function Section4() {
  return (
    <section
      className="
        flex flex-col items-center justify-center text-center
        px-6
        py-[220px] md:py-[480px]
      "
      style={{
        background: "radial-gradient(circle, #F9FAF8 0%, #A0AEC0 100%)",
      }}
    >
      <div className="mt-20 text-2xl md:text-4xl font-bold leading-relaxed text-black">
        <p>창업 이전부터, 창업 이후까지</p>
        <p>내 지역에 최적화된 창업을 AI가 설계하고,</p>
        <p>실패도 피하게 해주는</p>
        <p>풀 패키지 창업 AI 서비스</p>
      </div>

      <img src="/logo_black.png" alt="로고" className="mt-[110px] w-60 md:w-80" />
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
