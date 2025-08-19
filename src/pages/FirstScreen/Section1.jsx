import { Link } from "react-router-dom";

export default function Section1() {
  return (
    <section
      className="
        relative
        flex
        bg-gradient-to-r from-[#F0F9FF] via-[#F9FAF8] to-[#F0F9FF]
        min-h-[calc(100svh-96px)] md:min-h-[calc(100svh-128px)]
      "
    >
      <div className="mx-auto w-[88%] sm:w-[80%] lg:w-[70%] flex flex-col items-center justify-center text-center scale-[1.7]">
        <div className="w-40 h-40 sm:w-44 sm:h-44 mb-5 sm:mb-6">
          <img
            src="/AI.png"
            alt="AI Helper"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-xl sm:text-2xl md:text-[28px] font-black tracking-[-0.02em] text-slate-800">
          안양에 딱 맞는 창업, AI가 알려줍니다
        </h1>

        <p
          className="mt-2 sm:mt-3 text-sm sm:text-base font-medium"
          style={{ color: "#3E6BCE" }}
        >
          상권 분석부터 폐업 예측까지, 완전한 창업 설계 도우미
        </p>

        <div className="mt-6 sm:mt-7">
          <Link
            to="/start"
            className="inline-block rounded-xl px-6 sm:px-7 py-2.5 sm:py-3 text-white text-sm sm:text-base font-semibold shadow-md transition-colors"
            style={{ backgroundColor: "#7895CB" }}
          >
            안.착 지금 바로 시작하기
          </Link>
        </div>

        <Link
        to="/signup"
        className="mt-5 text-xs text-slate-400 hover:text-slate-500 underline-offset-2 hover:underline"
        >
            회원가입
        </Link>

      </div>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-10 sm:bottom-14 flex flex-col items-center scale-[1.6] select-none">
        <span className="text-xs font-medium text-gray-400 tracking-wide">Scroll</span>
        <img
          src="/arrow_left.png"
          alt=""
          className="w-4 h-4 -rotate-90 opacity-60 mt-0.5"
          aria-hidden="true"
        />
        <img
          src="/arrow_left.png"
          alt=""
          className="w-4 h-4 -rotate-90 opacity-60 -mt-[8px]"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
