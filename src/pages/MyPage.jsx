import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const [openHelp, setOpenHelp] = useState(false);
  const [openAsk, setOpenAsk] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-[#F9FAFB] min-h-screen pb-8">
      {/* 헤더 높이만큼 상단 패딩으로 보정 */}
      <main className="flex items-start pt-24 md:pt-28 lg:pt-32">
        {/* 🔹 가로 길이 넓힘 */}
        <div className="mx-auto w-full max-w-[960px] space-y-6">
          
          {/* 상단 프로필 카드 */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-6 flex items-center">
              <div className="w-16 h-16 rounded-full bg-[#B0BBCA] flex items-center justify-center overflow-hidden">
                <img
                  src="/Profile2.png"
                  alt="프로필"
                  className="w-11 h-11 object-cover opacity-90"
                />
              </div>

              <div className="ml-6 flex items-center gap-3 flex-wrap">
                <p className="text-base font-semibold text-gray-900">11asdfgh 님</p>
                {/* 회원 글씨 크기 줄임 */}
                <span className="text-xs font-bold text-blue-600 relative top-[1px]">
                  회원
                </span>

                {/* 버튼 글씨 크기 줄임 */}
                <button
                  onClick={() => navigate("/InfoEdit")}
                  className="px-3 py-1 text-xs rounded-md bg-gray-700 text-white font-medium hover:bg-gray-800 transition"
                >
                  정보 수정하기
                </button>
              </div>
            </div>
          </div>

          {/* 기본 설정 */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4">
              <h3 className="text-lg font-extrabold text-gray-900">기본 설정</h3>
            </div>

            {/* 도움말 */}
            <div className="px-6">
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/Commercial.png" alt="도움말" className="w-5 h-5" />
                  {/* 도움말 글씨 크기 줄임 */}
                  <span className="text-sm text-gray-800 font-bold">도움말</span>
                </div>
                <button
                  onClick={() => setOpenHelp(!openHelp)}
                  className="p-1"
                  aria-label="도움말 토글"
                >
                  <img
                    src="/arrow_left.png"
                    alt=""
                    className={`w-5 h-5 opacity-70 transition-transform ${
                      openHelp ? "rotate-90" : "-rotate-90"
                    }`}
                  />
                </button>
              </div>
              {openHelp && (
                <div className="pb-4 -mt-1">
                  <div className="rounded-md bg-[#EDEEEF] text-gray-700 text-sm px-4 py-4 leading-relaxed">
                    이 서비스는 원하는 창업 아이템에 맞춰 사업 계획과 폐업
                    리스크를 AI가 분석해주는 도우미입니다.
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-gray-200 w-[95%] mx-auto" />

            {/* 문의하기 */}
            <div className="px-6">
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/contact.png" alt="문의" className="w-5 h-5" />
                  {/* 문의하기 글씨 크기 줄임 */}
                  <span className="text-sm text-gray-800 font-bold">문의하기</span>
                </div>
                <button
                  onClick={() => setOpenAsk(!openAsk)}
                  className="p-1"
                  aria-label="문의 토글"
                >
                  <img
                    src="/arrow_left.png"
                    alt=""
                    className={`w-5 h-5 opacity-70 transition-transform ${
                      openAsk ? "rotate-90" : "-rotate-90"
                    }`}
                  />
                </button>
              </div>
              {openAsk && (
                <div className="pb-4 -mt-1">
                  <div className="rounded-md bg-[#EDEEEF] text-gray-700 text-sm px-4 py-4">
                    1:1 문의 - kimmj0382@naver.com
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 로그인 설정 */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4">
              <h3 className="text-lg font-extrabold text-gray-900">로그인 설정</h3>
            </div>

            <div className="px-6 py-4">
              <div className="flex items-center gap-3">
                <img src="/Logout.png" alt="로그아웃" className="w-5 h-5" />
                {/* 로그아웃 글씨 크기 줄임 */}
                <span className="text-sm text-gray-800 font-bold">로그아웃</span>
              </div>
            </div>

            <div className="h-px bg-gray-200 w-[95%] mx-auto" />

            <div className="px-6 py-4">
              <div className="flex items-center gap-3">
                <img src="/Padlock.png" alt="탈퇴" className="w-5 h-5" />
                {/* 서비스 탈퇴 글씨 크기 줄임 */}
                <span className="text-sm text-gray-800 font-bold">서비스 탈퇴</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
