export default function Screen2() {
  return (
    <section className="relative w-full min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 w-full min-h-screen flex flex-col items-center">
        <h2 className="mt-28 text-center text-white mb-10 tracking-wide">
          <span className="text-[1.6rem] md:text-[2rem] font-bold">안.착</span>
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
                <h3 className="text-[52px] md:text-[58px] font-extrabold text-[#1A4CB3]">
                실행 중심
                </h3>
                <img
                src="/focus.png"
                alt="실행 중심"
                className="w-36 h-36 md:w-40 md:h-40 object-contain"
                />
            </div>
            <p className="mt-1 text-[26px] md:text-[30px] leading-[2.8rem] text-gray-900 font-semibold">
                아이디어→실행→운영까지<br />모든 과정을 함께 합니다
            </p>
            </div>

            {/* 데이터 기반 */}
            <div className="bg-white rounded-[48px] shadow-[0_12px_40px_rgba(0,0,0,0.15)]
                            p-16 min-h-[460px] flex flex-col">
            <div className="flex justify-between items-start w-full mt-6">
                <h3 className="text-[52px] md:text-[58px] font-extrabold text-[#1A4CB3]">
                데이터 기반
                </h3>
                <img
                src="/data.png"
                alt="데이터 기반"
                className="w-36 h-36 md:w-40 md:h-40 object-contain"
                />
            </div>
            <p className="mt-1 text-[26px] md:text-[30px] leading-[2.8rem] text-gray-900 font-semibold">
                상권 + 폐업률 + 유사 점포<br />정보 등을 데이터 기반으로 제공합니다
            </p>
            </div>

            {/* 현장 밀착 */}
            <div className="bg-white rounded-[48px] shadow-[0_12px_40px_rgba(0,0,0,0.15)]
                            p-16 min-h-[460px] flex flex-col">
            <div className="flex justify-between items-start w-full mt-6">
                <h3 className="text-[52px] md:text-[58px] font-extrabold text-[#1A4CB3]">
                현장 밀착
                </h3>
                <img
                src="/Where.png"
                alt="현장 밀착"
                className="w-36 h-36 md:w-40 md:h-40 object-contain"
                />
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

