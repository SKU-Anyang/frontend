// src/pages/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");     // ← 아이디만 입력
  const [password, setPassword] = useState(""); // ← 비번 사용 시 유지(미사용이면 UI/검증에서 제거)
  const [keep, setKeep] = useState(true);       // 로그인 상태 유지

  const isValid = !!userId.trim() && !!password.trim();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post("http://3.36.114.249:8080/api/auth/login", {
        userId,
        password,
      });

      // ✅ 토큰 파싱 (서버는 accessToken 사용)
      const token =
        res?.data?.accessToken ||
        res?.data?.token ||
        res?.headers?.authorization?.replace(/^Bearer\s+/i, "") ||
        res?.headers?.Authorization?.replace(/^Bearer\s+/i, "");

      if (!token) {
        console.log("응답 데이터:", res?.data, "헤더:", res?.headers);
        alert("토큰이 응답에 없습니다.");
        return;
      }

      // ✅ 저장소 선택: 유지(keep)면 localStorage, 아니면 sessionStorage
      const storage = keep ? window.localStorage : window.sessionStorage;
      storage.setItem("accessToken", token);
      storage.setItem("keepLogin", keep ? "true" : "false");

      // (선택) 사용자 정보 함께 저장 → 헤더에서 닉네임 표기 가능
      const userPayload = {
        userId: res?.data?.userId ?? userId,
        email: res?.data?.email ?? "",
        nickname: res?.data?.nickname ?? "",
      };
      storage.setItem("user", JSON.stringify(userPayload));

      // 이후 axios 기본 인증 헤더 세팅
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 헤더 등 전역에 로그인 상태 변경 알림(같은 탭)
      window.dispatchEvent(new Event("auth-changed"));

      // ✅ 네비게이션 (원하는 경로로 변경 가능)
      navigate("/", { replace: true });
    } catch (err) {
      console.error("로그인 실패:", err?.response?.data || err.message);
      alert(err?.response?.data?.message || "로그인 실패. 아이디/비밀번호를 확인하세요.");
    }
  };

  return (
    <main className="relative bg-[#B0BBCA] min-h-screen flex items-center justify-center px-3 py-10">
      <div className="w-full max-w-[520px] mt-12">
        <div className="bg-white rounded-2xl shadow-md px-10 pt-8 pb-14 min-h-[400px]">
          {/* 타이틀 */}
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-[22px] font-extrabold text-gray-900 leading-none">로그인</h1>
            <img src="/login.png" alt="로그인" className="w-20 h-20 -ml-1" />
          </div>

          {/* 폼 */}
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            {/* 아이디 */}
            <div>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="아이디 (예: test1)"
                className="w-full h-[42px] rounded-lg border border-gray-300 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            {/* 비밀번호 (미사용이면 이 블록/검증 제거) */}
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="패스워드"
                className="w-full h-[42px] rounded-lg border border-gray-300 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
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

                {/* 아이디/비번 찾기(옵션) */}
                <div className="text-[9px] text-black">
                  <button type="button" className="hover:underline">아이디 찾기</button>
                  <span className="mx-1">|</span>
                  <button type="button" className="hover:underline">비밀번호 찾기</button>
                </div>
              </div>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={!isValid}
              className={
                "mt-6 w-full h-[48px] rounded-lg text-white font-bold text-base transition " +
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
