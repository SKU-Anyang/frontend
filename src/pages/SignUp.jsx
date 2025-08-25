import { useState } from "react";

export default function SignUp() {
  const [form, setForm] = useState({ id: "", pw: "", pw2: "", email: "", phone: "" });
  const [agree, setAgree] = useState({ all: false, t1: false, t2: false });

  const isValid =
    form.id && form.pw && form.pw2 && form.email && form.phone &&
    form.pw === form.pw2 && agree.t1 && agree.t2;

  const onChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
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

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    alert("회원가입 가능합니다! (API 연동 시 처리)");
  };

  return (
    <main className="bg-[#B0BBCA] min-h-screen flex items-start justify-center px-3 pb-10 pt-24">
      {/* 흰 박스 */}
      <div className="w-full max-w-[520px] mt-4">
        <div className="bg-white rounded-2xl shadow-md px-6 py-8">
          {/* 제목 + 이미지 */}
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


          {/* 기본정보 */}
          <section>
            <p className="text-[12px] font-semibold text-gray-900">기본정보</p>

            <form onSubmit={onSubmit} className="mt-4 space-y-3.5">
              <LabeledInput label="아이디">
                <input
                  type="text"
                  value={form.id}
                  onChange={onChange("id")}
                  className="w-full h-7 rounded border border-gray-300 px-2 text-[11px] outline-none focus:ring-1 focus:ring-blue-400"
                />
              </LabeledInput>

              <LabeledInput label="비밀번호">
                <input
                  type="password"
                  value={form.pw}
                  onChange={onChange("pw")}
                  className="w-full h-7 rounded border border-gray-300 px-2 text-[11px] outline-none focus:ring-1 focus:ring-blue-400"
                />
              </LabeledInput>

              <LabeledInput label="비밀번호 확인">
                <input
                  type="password"
                  value={form.pw2}
                  onChange={onChange("pw2")}
                  className="w-full h-7 rounded border border-gray-300 px-2 text-[11px] outline-none focus:ring-1 focus:ring-blue-400"
                />
              </LabeledInput>

              <LabeledInput label="이메일">
                <input
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  className="w-full h-7 rounded border border-gray-300 px-2 text-[11px] outline-none focus:ring-1 focus:ring-blue-400"
                />
              </LabeledInput>

              <LabeledInput label="연락처">
                <input
                  type="text"
                  value={form.phone}
                  onChange={onChange("phone")}
                  className="w-full h-7 rounded border border-gray-300 px-2 text-[11px] outline-none focus:ring-1 focus:ring-blue-400"
                />
              </LabeledInput>

              {/* 약관 동의 */}
              <div className="pt-2">
                <p className="text-[12px] font-semibold text-gray-900 mb-2">약관 동의</p>

                {/* 전체 약관 */}
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

                {/* 필수 약관 */}
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

              {/* 회원가입 버튼 */}
              <button
                type="submit"
                disabled={!isValid}
                className={
                  "w-full h-9 rounded-md text-white font-semibold text-[12px] transition " +
                  (isValid ? "bg-[#2563eb] hover:opacity-90" : "bg-gray-300 cursor-not-allowed")
                }
              >
                회원가입
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

/* 라벨 + 인풋 묶음 */
function LabeledInput({ label, children }) {
  return (
    <div className="grid grid-cols-[70px_1fr] items-center gap-2.5">
      <span className="text-gray-600 text-[11px] font-medium">{label}</span>
      {children}
    </div>
  );
}
