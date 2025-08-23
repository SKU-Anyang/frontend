import { useState } from "react";

export default function Login() {
  // 입력값
  const [idOrEmail, setIdOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keep, setKeep] = useState(true);

  // 회원가입 코드 컨벤션에 맞춰 isValid로 통일
  const isValid = idOrEmail.trim() && password.trim();

  // 회원가입과 동일한 이름(onSubmit) 사용
  const onSubmit = (e) => {
    e.preventDefault();
    if (!isValid) {
      alert("아이디/이메일과 비밀번호를 입력해주세요.");
      return;
    }
    alert("로그인 시도! (API 연동 시 처리)");
  };

  return (
    <main className="relative bg-[#B0BBCA] min-h-screen flex items-center justify-center px-6 py-32">

      {/* 흰 박스 */}
      <div className="w-full max-w-[1180px] mt-10 md:mt-14 lg:mt-20">
        <div className="bg-white rounded-[40px] shadow-[0_28px_60px_rgba(0,0,0,0.1)] px-24 pt-12 pb-28">
          {/* 로그인+이미지 */}
          <div className="flex items-center gap-6 mb-16">
            <h1 className="text-[48px] md:text-[56px] font-extrabold text-gray-900 leading-none">
              로그인
            </h1>
            <img
              src="/login.png"
              alt="로그인"
              className="w-45 h-45 -ml-8"
            />
          </div>

          {/* 폼 */}
          <form onSubmit={onSubmit} className="space-y-10">
            {/* 이메일주소, 아이디 */}
            <div>
              <input
                type="text"
                value={idOrEmail}
                onChange={(e) => setIdOrEmail(e.target.value)}
                placeholder="이메일 주소 또는 아이디"
                className="w-full h-[92px] rounded-2xl border border-gray-300 px-8 text-2xl
                           outline-none focus:ring-4 focus:ring-blue-500 shadow-md"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="패스워드"
                className="w-full h-[92px] rounded-2xl border border-gray-300 px-8 text-2xl
                           outline-none focus:ring-4 focus:ring-blue-500 shadow-md"
              />

              {/* 줄 같게 맞춰줌 */}
              <div className="mt-4 flex items-center justify-between">
                {/* 로그인 상태 유지 */}
                <label className="flex items-center gap-3 text-xl text-gray-800">
                  <input
                    type="checkbox"
                    checked={keep}
                    onChange={() => setKeep((v) => !v)}
                    className="w-7 h-7 rounded-lg border border-gray-400"
                  />
                  로그인 상태 유지
                </label>

                {/* 아이디|비밀번호 찾기 */}
                <div className="text-lg text-black">
                  <button type="button" className="hover:underline">아이디 찾기</button>
                  <span className="mx-3">|</span>
                  <button type="button" className="hover:underline">비밀번호 찾기</button>
                </div>
              </div>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={!isValid}
              className={
                "mt-12 mb-12 w-full h-[96px] rounded-2xl text-white font-extrabold text-2xl transition " +
                (isValid ? "bg-[#2563eb] hover:opacity-90" : "bg-gray-300 cursor-not-allowed")
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
