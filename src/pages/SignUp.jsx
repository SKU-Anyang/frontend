// src/pages/SignUp.jsx
import { useState } from "react";
import axios from "axios";

export default function SignUp() {
  const [form, setForm] = useState({
    userId: "",
    password: "",
    passwordConfirm: "",
    email: "",
    nickname: "",
    region: "",
    interest: "",
  });

  const [agree, setAgree] = useState({ all: false, t1: false, t2: false });
  const [loading, setLoading] = useState(false);

  // 입력 변경
  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // 전체동의 / 개별동의
  const toggleAll = () => {
    const next = !agree.all;
    setAgree({ all: next, t1: next, t2: next });
  };

  const toggleOne = (key) => () =>
    setAgree((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      next.all = next.t1 && next.t2;
      return next;
    });

  // ✅ onSubmit: 응답 코드/메시지로 성공/실패 판정 (프록시 X, 직접 호출)
  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const body = {
        userId: form.userId.trim(),
        email: form.email.trim(),
        password: form.password,
        passwordConfirm: form.passwordConfirm,
        nickname: form.nickname.trim(),
        region: form.region.trim(),
        interest: form.interest.trim(),
      };

      console.log("📦 [onSubmit] 전송 데이터:", body);

      const res = await axios.post(
        "http://3.36.114.249:8080/api/auth/signup",
        body,
        {
          headers: { "Content-Type": "application/json" },
          // 응답이 오기만 하면 여기서 처리 (400/409/422 등 실패도 catch로 안 감)
          validateStatus: (s) => s >= 200 && s < 500,
          timeout: 10000,
        }
      );

      console.log("📡 status:", res.status, "data:", res.data);

      if (res.status === 200 || res.status === 201) {
        alert(res.data?.message ?? "회원가입 성공!");
        console.log("✅ 성공:", res.data);
        // 필요하면 이동: navigate("/login")
      } else {
        alert(res.data?.message ?? `회원가입 실패 (HTTP ${res.status})`);
        console.warn("⚠️ 실패:", res.data);
      }
    } catch (error) {
      console.error("❌ 네트워크/환경 오류:", error);
      if (error.message?.includes("timeout")) {
        alert("요청 시간이 초과되었습니다.");
      } else {
        alert("서버 연결 오류: " + error.message);
      }
    } finally {
      setLoading(false);
      console.log("🔚 finally");
    }
  };

  return (
    <main className="bg-[#B0BBCA] min-h-screen flex items-start justify-center px-3 pb-10 pt-24">
      <div className="w-full max-w-[520px] mt-4">
        <div className="bg-white rounded-2xl shadow-md px-6 py-8">
          {/* 타이틀 */}
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-[22px] md:text-[26px] font-extrabold text-gray-900">
              회원가입
            </h1>
            <img
              src="/signup.png"
              alt="회원가입 이미지"
              className="w-12 h-12 md:w-14 md:h-14 object-contain"
            />
          </div>

          {/* 폼 */}
          <section>
            <p className="text-[12px] font-semibold text-gray-900">기본정보</p>

            <form onSubmit={onSubmit} className="mt-4 space-y-3.5" autoComplete="off">
              <LabeledInput label="아이디">
                <input
                  type="text"
                  value={form.userId}
                  onChange={onChange("userId")}
                  autoComplete="username"
                  className="w-full h-7 rounded border border-gray-300 px-2 text-[11px] outline-none focus:ring-1 focus:ring-blue-400"
                />
              </LabeledInput>

              <LabeledInput label="비밀번호">
                <input
                  type="password"
                  value={form.password}
                  onChange={onChange("password")}
                  autoComplete="new-password"
                  className="w-full h-7 rounded border border-gray-300 px-2 text-[11px] outline-none focus:ring-1 focus:ring-blue-400"
                />
              </LabeledInput>

              <LabeledInput label="비밀번호 확인">
                <input
                  type="password"
                  value={form.passwordConfirm}
                  onChange={onChange("passwordConfirm")}
                  autoComplete="new-password"
                  className="w-full h-7 rounded border border-gray-300 px-2 text-[11px] outline-none focus:ring-1 focus:ring-blue-400"
                />
              </LabeledInput>

              <LabeledInput label="이메일">
                <input
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  autoComplete="email"
                  className="w-full h-7 rounded border border-gray-300 px-2 text-[11px] outline-none focus:ring-1 focus:ring-blue-400"
                />
              </LabeledInput>

              <LabeledInput label="닉네임">
                <input
                  type="text"
                  value={form.nickname}
                  onChange={onChange("nickname")}
                  autoComplete="nickname"
                  className="w-full h-7 rounded border border-gray-300 px-2 text-[11px] outline-none focus:ring-1 focus:ring-blue-400"
                />
              </LabeledInput>

              <LabeledInput label="지역">
                <input
                  type="text"
                  value={form.region}
                  onChange={onChange("region")}
                  autoComplete="address-level1"
                  className="w-full h-7 rounded border border-gray-300 px-2 text-[11px] outline-none focus:ring-1 focus:ring-blue-400"
                />
              </LabeledInput>

              <LabeledInput label="관심사">
                <input
                  type="text"
                  value={form.interest}
                  onChange={onChange("interest")}
                  autoComplete="off"
                  className="w-full h-7 rounded border border-gray-300 px-2 text-[11px] outline-none focus:ring-1 focus:ring-blue-400"
                />
              </LabeledInput>

              {/* 약관 동의 */}
              <div className="pt-2">
                <p className="text-[12px] font-semibold text-gray-900 mb-2">약관 동의</p>

                <label className="flex items-center gap-2 text-[11px] font-medium">
                  <input
                    type="checkbox"
                    checked={agree.all}
                    onChange={toggleAll}
                    className="w-3 h-3 appearance-none rounded border border-gray-400 checked:bg-blue-600 checked:border-blue-600"
                  />
                  <span className="text-gray-900">전체 약관 동의</span>
                </label>

                <div className="w-full h-px bg-gray-300 my-2" />

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-[11px] font-medium">
                      <input
                        type="checkbox"
                        checked={agree.t1}
                        onChange={toggleOne("t1")}
                        className="w-3 h-3 appearance-none rounded border border-gray-400 checked:bg-blue-600 checked:border-blue-600"
                      />
                      <span className="text-gray-700">[필수] 이용 약관</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => alert("약관 내용 보기")}
                      className="px-2 py-0.5 text-[10px] rounded bg-[#2563eb] text-white"
                    >
                      내용보기
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-[11px] font-medium">
                      <input
                        type="checkbox"
                        checked={agree.t2}
                        onChange={toggleOne("t2")}
                        className="w-3 h-3 appearance-none rounded border border-gray-400 checked:bg-blue-600 checked:border-blue-600"
                      />
                      <span className="text-gray-700">[필수] 개인정보 수집 및 이용 동의</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => alert("약관 내용 보기")}
                      className="px-2 py-0.5 text-[10px] rounded bg-[#2563eb] text-white"
                    >
                      내용보기
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full h-9 rounded-md text-white font-semibold text-[12px] transition ${
                  loading ? "bg-[#2563eb]/60 cursor-not-allowed" : "bg-[#2563eb] hover:opacity-90"
                }`}
              >
                {loading ? "처리 중..." : "회원가입"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

// 라벨 + 인풋 묶음
function LabeledInput({ label, children }) {
  return (
    <div className="grid grid-cols-[70px_1fr] items-center gap-2.5">
      <span className="text-gray-600 text-[11px] font-medium">{label}</span>
      {children}
    </div>
  );
}
