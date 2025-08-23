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
    <main className="relative bg-[#B0BBCA] min-h-screen flex items-start justify-center px-5 pb-16 pt-28 md:pt-36 lg:pt-44">
      {/* 흰 박스 (한 단계 크게) */}
      <div className="w-full max-w-[1040px] mt-6 md:mt-10 lg:mt-16">
        <div className="bg-white rounded-[2rem] shadow-xl px-12 py-12 md:px-14 md:py-14">
          <h1 className="text-[40px] md:text-[44px] font-black text-gray-900 leading-tight text-left">
            회원가입
          </h1>

          {/* 기본정보 */}
          <section className="mt-8">
            <p className="text-[24px] md:text-[26px] font-black text-gray-900">기본정보</p>

            <form onSubmit={onSubmit} className="mt-8 space-y-7">
              <LabeledInput label="아이디">
                <input
                  type="text"
                  value={form.id}
                  onChange={onChange("id")}
                  className="w-full h-16 rounded-lg border border-gray-300 px-5 text-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </LabeledInput>

              <LabeledInput label="비밀번호">
                <input
                  type="password"
                  value={form.pw}
                  onChange={onChange("pw")}
                  className="w-full h-16 rounded-lg border border-gray-300 px-5 text-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </LabeledInput>

              <LabeledInput label="비밀번호 재확인">
                <input
                  type="password"
                  value={form.pw2}
                  onChange={onChange("pw2")}
                  className="w-full h-16 rounded-lg border border-gray-300 px-5 text-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </LabeledInput>

              <LabeledInput label="이메일">
                <input
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  className="w-full h-16 rounded-lg border border-gray-300 px-5 text-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </LabeledInput>

              <LabeledInput label="연락처">
                <input
                  type="text"
                  value={form.phone}
                  onChange={onChange("phone")}
                  className="w-full h-16 rounded-lg border border-gray-300 px-5 text-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </LabeledInput>

              {/* 약관 동의 */}
              <div className="pt-6">
                <p className="text-[24px] md:text-[26px] font-black text-gray-900 mb-5">약관 동의</p>

                {/* 전체 약관 */}
                <label className="flex items-center gap-3 py-3 text-2xl font-black">
                  <input
                    type="checkbox"
                    checked={agree.all}
                    onChange={toggleAll}
                    className="w-7 h-7 appearance-none rounded-full border border-gray-400 checked:bg-blue-600 checked:border-blue-600"
                  />
                  <span className="text-gray-900">전체 약관 동의</span>
                </label>

                <div className="w-full h-px bg-gray-300 my-6" />

                {/* 필수 약관 2개 */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 text-xl font-bold">
                      <input
                        type="checkbox"
                        checked={agree.t1}
                        onChange={toggleOne("t1")}
                        className="w-7 h-7 appearance-none rounded-full border border-gray-400 checked:bg-blue-600 checked:border-blue-600"
                      />
                      <span className="text-gray-700">[필수] 이용 약관</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => alert("약관 내용 보기")}
                      className="px-6 py-2.5 text-lg rounded-md bg-[#2563eb] text-white"
                    >
                      내용보기
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 text-xl font-bold">
                      <input
                        type="checkbox"
                        checked={agree.t2}
                        onChange={toggleOne("t2")}
                        className="w-7 h-7 appearance-none rounded-full border border-gray-400 checked:bg-blue-600 checked:border-blue-600"
                      />
                      <span className="text-gray-700">[필수] 개인정보 수집 및 이용 동의</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => alert("약관 내용 보기")}
                      className="px-6 py-2.5 text-lg rounded-md bg-[#2563eb] text-white"
                    >
                      내용보기
                    </button>
                  </div>
                </div>
              </div>

              {/* 회원가입 */}
              <button
                type="submit"
                disabled={!isValid}
                className={
                  "w-full h-20 rounded-xl text-white font-extrabold text-2xl transition " +
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

/* 라벨+인풋 묶음 (한 단계 업) */
function LabeledInput({ label, children }) {
  return (
    <div className="grid grid-cols-[150px_1fr] items-center gap-7">
      <span className="text-gray-600 text-xl font-bold">{label}</span>
      {children}
    </div>
  );
}
