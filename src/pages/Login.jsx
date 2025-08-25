import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keep, setKeep] = useState(true);

  const isValid = email.trim() && password.trim();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(
        "http://3.36.114.249:8080/api/auth/login",
        {
          userId: email,
          password: password,
        }
      );

      console.log("로그인 성공:", response.data);

      // 서버에서 토큰 받아오면 localStorage에 저장
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // 로그인 상태 유지 체크
      if (keep) {
        localStorage.setItem("keepLogin", "true");
      }

      alert("로그인 성공!");
    } catch (error) {
      console.error("로그인 실패:", error.response?.data || error.message);
      alert(error.response?.data?.message || "로그인 실패. 이메일/비밀번호를 확인하세요.");
    }
  };

  return (
    <main className="relative bg-[#B0BBCA] min-h-screen flex items-center justify-center px-3 py-10">
      {/* 흰 박스 */}
      <div className="w-full max-w-[520px] mt-12">
        <div className="bg-white rounded-2xl shadow-md px-10 pt-8 pb-14 min-h-[400px]">
          {/* 로그인+이미지 */}
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-[22px] font-extrabold text-gray-900 leading-none">
              로그인
            </h1>
            <img
              src="/login.png"
              alt="로그인"
              className="w-20 h-20 -ml-1"
            />
          </div>

          {/* 폼 */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* 이메일 */}
            <div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일"
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

                {/* 아이디/비밀번호 찾기 */}
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