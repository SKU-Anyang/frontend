export default function Section3() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto w-[92%] sm:w-[86%] lg:w-[76%] space-y-[200px]">

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
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-6">
            <h3 className="text-center md:text-left text-[28px] md:text-[32px] font-extrabold leading-snug">
              <span className="text-[#1A4CB3]">비즈니스 구성</span>
              <br />
              <span className="text-[#1A4CB3]">폐업 리스크 분석까지</span>{" "}
              <span className="text-black">체계적인 창업을 위해 도와드려요</span>
            </h3>

            <h3 className="text-center md:text-right text-[28px] md:text-[32px] font-extrabold leading-snug">
              <span className="text-[#1A4CB3]">유사 점포 분석</span>
              <span className="text-black">으로</span>
              <br />
              <span className="text-black">더욱 구체화된 서비스를 제공합니다</span>
            </h3>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* 왼쪽 */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-[26px] md:text-[30px] font-extrabold text-[#1A4CB3]">
              B2B사장님 도우미
            </h3>
            <p className="mt-2 text-[16px] md:text-[18px] font-semibold text-gray-800">
              기능을 이용해 자신만의 창업을 이어나가 보세요
            </p>

            <div className="mt-6 bg-white rounded-[48px] shadow-[0_10px_28px_rgba(0,0,0,0.12)] p-10 w-full flex flex-col items-center">
              <img src="/alien.png" alt="도우미" className="w-20 h-20 mb-6" />
              <div className="flex gap-3 text-sm text-gray-700">
                <span className="px-4 py-2 bg-gray-100 rounded-full">운영 전략</span>
                <span className="px-4 py-2 bg-gray-100 rounded-full">SNS 글쓰기 도우미</span>
                <span className="px-4 py-2 bg-gray-100 rounded-full">고객 응대</span>
              </div>
              <div className="mt-6 w-full h-2 bg-gray-200 rounded-full" />
            </div>
          </div>

          {/* 오른쪽 */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-[26px] md:text-[30px] font-extrabold text-[#1A4CB3]">
              사용자 반응 기반 큐레이션으로
            </h3>
            <p className="mt-2 text-[16px] md:text-[18px] font-semibold text-gray-800">
              맞춤형 창업 아이디어나 정보를 드려요
            </p>

            <div className="mt-6 bg-white rounded-[48px] shadow-[0_10px_28px_rgba(0,0,0,0.12)] p-8 w-full">
              <p className="text-lg font-bold text-left">북카페 + 작가의 방</p>
              <p className="text-sm text-[#1A4CB3] text-left mt-1">
                독서+창작 감성 공간 (에세이/작가 지망생 타깃)
              </p>

              <ul className="mt-4 text-left text-sm text-gray-800 list-disc pl-5 space-y-1">
                <li>핵심 콘셉트: 작가가 되고 싶은 20대를 위한 감성 독립서점+카페</li>
                <li>주 타깃: 글쓰는 대학생, 프리랜서, 감성 소비자</li>
                <li>운영: 독립출판 전시·판매, 글쓰기 모임·워크숍</li>
                <li>포인트: ‘의미 있는 공간’으로 소비하고 싶어하는 수요 공략</li>
              </ul>

              <div className="mt-5 flex justify-end items-center gap-3">
                <img src="/trash.png" alt="삭제" className="w-6 h-6" />
                <span className="text-[20px]" role="img" aria-label="like">❤️</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
