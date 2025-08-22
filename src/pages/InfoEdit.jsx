export default function InfoEdit() {
  return (
    <main className="bg-[#B0BBCA] min-h-screen flex items-start pt-80 pb-32">
      <div className="w-[98%] max-w-[1500px] mx-auto">
        {/* 흰 박스 */}
        <div className="bg-white rounded-2xl min-h-[880px] flex flex-col px-20 py-16">
          
          {/* 제목 */}
          <div className="mb-14">
            <h1 className="text-[36px] md:text-[40px] font-extrabold text-gray-900">
              정보 수정하기
            </h1>
          </div>

          {/* 흰 박스 안에 내용 */}
          <div className="flex-1">
            <div className="grid grid-cols-[220px_1fr] gap-x-20 gap-y-10">
              {/* 프로필 */}
              <div className="flex items-start justify-center">
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-[#B0BBCA] flex items-center justify-center overflow-hidden">
                  <img
                    src="/Profile2.png"
                    alt="프로필"
                    className="w-22 h-22 md:w-26 md:h-26 object-cover opacity-90"
                  />
                </div>
              </div>

              {/* 오른쪽 폼 */}
              <div className="w-full">
                <p className="mt-2 text-[26px] md:text-[28px] font-bold text-gray-900">
                  기본정보
                </p>

                <div className="mt-10 space-y-9">
                  <FieldRow label="아이디">
                    <Input type="text" placeholder=" " />
                  </FieldRow>

                  <FieldRow label="비밀번호">
                    <Input type="password" placeholder=" " />
                  </FieldRow>

                  <FieldRow label="비밀번호 확인">
                    <Input type="password" placeholder=" " />
                  </FieldRow>

                  <FieldRow label="이메일">
                    <Input type="email" placeholder=" " />
                  </FieldRow>

                  <FieldRow label="연락처">
                    <Input type="text" placeholder=" " />
                  </FieldRow>
                </div>
              </div>
            </div>

            {/* 저장하기 버튼 */}
            <div className="mt-20 flex justify-center">
              <button
                type="button"
                className="min-w-[220px] px-10 py-5 rounded-full bg-[#2563eb] text-white text-[20px] md:text-[22px] font-bold"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* 레이아웃 */
function FieldRow({ label, children }) {
  return (
    <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-center gap-8">
      <span className="text-[20px] md:text-[22px] text-gray-700 font-medium">
        {label}
      </span>
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-[520px] md:w-[640px] rounded-md border border-gray-300 outline-none px-6 py-4 text-[18px] md:text-[20px] focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    />
  );
}
