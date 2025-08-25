import { useState } from "react";

export default function Login() {
  const [idOrEmail, setIdOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keep, setKeep] = useState(true);

  const isValid = idOrEmail.trim() && password.trim();

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isValid) {
      alert("아이디/이메일과 비밀번호를 입력해주세요.");
      return;
    }
    alert("로그인 시도! (API 연동 시 처리)");
  };

  return (
    <main className="relative bg-[#B0BBCA] min-h-screen flex items-center justify-center px-3 py-10">
      {/* 흰 박스 */}
      <div className="w-full max-w-[520px] mt-12">
        <div className="bg-white rounded-2xl shadow-md px-10 pt-8 pb-14 min-h-[400px]">
          {/* ↑ 세로 길이 줄임: pb-20 → pb-14, min-h-[480px] → min-h-[400px] */}

          {/* 로그인+이미지 */}
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-[22px] font-extrabold text-gray-900 leading-none">
              로그인
            </h1>
            <img
              src="/login.png"
              alt="로그인"
              className="w-20 h-20 -ml-1" // 이미지 크게
            />
          </div>

          {/* 폼 */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* 이메일주소, 아이디 */}
            <div>
              <input
                type="text"
                value={idOrEmail}
                onChange={(e) => setIdOrEmail(e.target.value)}
                placeholder="이메일 주소 또는 아이디"
                className="w-full h-[42px] rounded-lg border border-gray-300 px-4 text-sm
                           outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="패스워드"
                className="w-full h-[42px] rounded-lg border border-gray-300 px-4 text-sm
                           outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />

              {/* 줄 맞춤 */}
              <div className="mt-2 flex items-center justify-between">
                {/* 로그인 상태 유지 */}
                <label className="flex items-center gap-1 text-xs text-gray-800">
                  <input
                    type="checkbox"
                    checked={keep}
                    onChange={() => setKeep((v) => !v)}
                    className="w-3 h-3 rounded border border-gray-400"
                  />
                  로그인 상태 유지
                </label>

                {/* 아이디|비밀번호 찾기 */}
                <div className="text-[9px] text-black">
                  <button type="button" className="hover:underline">
                    아이디 찾기
                  </button>
                  <span className="mx-1">|</span>
                  <button type="button" className="hover:underline">
                    비밀번호 찾기
                  </button>
                </div>
              </div>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={!isValid}
              className={
                "mt-6 w-full h-[48px] rounded-lg text-white font-bold text-base transition " +
                (isValid
                  ? "bg-[#2563eb] hover:opacity-90"
                  : "bg-gray-300 cursor-not-allowed")
              }
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
