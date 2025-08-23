import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const [openHelp, setOpenHelp] = useState(false);
  const [openAsk, setOpenAsk] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-[#F9FAFB] min-h-screen pt-50 pb-32">
      <main className="flex items-start">
        <div className="mx-auto w-full max-w-[1600px] xl:max-w-[1700px] 2xl:max-w-[1800px] space-y-16 mt-10 md:mt-16 lg:mt-24">
          
          {/* 상단 프로필 카드 */}
          <div className="bg-white rounded-2xl">
            <div className="px-16 py-12 flex items-center">
              <div className="w-36 h-36 md:w-40 md:h-40 rounded-full bg-[#B0BBCA] flex items-center justify-center overflow-hidden">
                <img
                  src="/Profile2.png"
                  alt="프로필"
                  className="w-24 h-24 md:w-28 md:h-28 object-cover opacity-90"
                />
              </div>

              <div className="ml-10 flex items-center gap-6 flex-wrap">
                <p className="text-[30px] md:text-[32px] font-semibold text-gray-900">
                  11asdfgh 님
                </p>
                <span className="text-[20px] md:text-[21px] font-bold text-blue-600 relative top-[5px]">
                  회원
                </span>

                <button
                  onClick={() => navigate("/InfoEdit")}
                  className="px-6 py-2 text-[16px] rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-800 transition"
                >
                  정보 수정하기
                </button>
              </div>
            </div>
          </div>

          {/* 기본 설정 */}
          <div className="bg-white rounded-2xl">
            <div className="px-16 py-8">
              <h3 className="text-[30px] md:text-[34px] font-extrabold text-gray-900">
                기본 설정
              </h3>
            </div>

            {/* 도움말 */}
            <div className="px-16">
              <div className="py-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <img src="/Commercial.png" alt="도움말" className="w-9 h-9" />
                  <span className="text-[22px] md:text-[23px] text-gray-800 font-bold">
                    도움말
                  </span>
                </div>
                <button
                  onClick={() => setOpenHelp(!openHelp)}
                  className="p-2"
                  aria-label="도움말 토글"
                >
                  <img
                    src="/arrow_left.png"
                    alt=""
                    className={`w-7 h-7 opacity-70 transition-transform ${
                      openHelp ? "rotate-90" : "-rotate-90"
                    }`}
                  />
                </button>
              </div>
              {openHelp && (
                <div className="pb-8 -mt-2">
                  <div className="rounded-lg bg-[#EDEEEF] text-gray-700 text-[20px] md:text-[21px] px-6 py-6 leading-relaxed">
                    이 서비스는 원하는 창업 아이템에 맞춰 사업 계획과 폐업
                    리스크를 AI가 분석해주는 도우미입니다.
                  </div>
                </div>
              )}
            </div>
            <div className="h-px bg-gray-200 w-[95%] mx-auto" />
            
            {/* 문의하기 */}
            <div className="px-16">
              <div className="py-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <img src="/contact.png" alt="문의" className="w-9 h-9" />
                  <span className="text-[22px] md:text-[23px] text-gray-800 font-bold">
                    문의하기
                  </span>
                </div>
                <button
                  onClick={() => setOpenAsk(!openAsk)}
                  className="p-2"
                  aria-label="문의 토글"
                >
                  <img
                    src="/arrow_left.png"
                    alt=""
                    className={`w-7 h-7 opacity-70 transition-transform ${
                      openAsk ? "rotate-90" : "-rotate-90"
                    }`}
                  />
                </button>
              </div>
              {openAsk && (
                <div className="pb-8 -mt-2">
                  <div className="rounded-lg bg-[#EDEEEF] text-gray-700 text-[20px] md:text-[21px] px-6 py-6">
                    1:1 문의 - kimmj0382@naver.com
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 로그인 설정 */}
          <div className="bg-white rounded-2xl">
            <div className="px-16 py-8">
              <h3 className="text-[30px] md:text-[34px] font-extrabold text-gray-900">
                로그인 설정
              </h3>
            </div>

            <div className="px-16 py-8">
              <div className="flex items-center gap-6">
                <img src="/Logout.png" alt="로그아웃" className="w-9 h-9" />
                <span className="text-[22px] md:text-[23px] text-gray-800 font-bold">
                  로그아웃
                </span>
              </div>
            </div>
            <div className="h-px bg-gray-200 w-[95%] mx-auto" />
            <div className="px-16 py-8">
              <div className="flex items-center gap-6">
                <img src="/Padlock.png" alt="탈퇴" className="w-9 h-9" />
                <span className="text-[22px] md:text-[23px] text-gray-800 font-bold">
                  서비스 탈퇴
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
