// src/pages/InfoEdit.jsx
export default function InfoEdit() {
  return (
    <main className="bg-[#B0BBCA] min-h-screen flex items-start pt-36 pb-16">
      <div className="w-[95%] max-w-[640px] mx-auto">
        {/* 흰 박스 */}
        <div className="bg-white rounded-2xl shadow-sm min-h-[340px] px-6 py-8">
          {/* 제목 */}
          <div className="mb-6">
            <h1 className="text-[18px] md:text-[20px] font-extrabold text-gray-900">
              정보 수정하기
            </h1>
          </div>

          {/* 내용 */}
          <div className="grid grid-cols-[90px_1fr] gap-x-6 gap-y-4">
            {/* 왼쪽: 프로필 아이콘 */}
            <div className="flex items-start justify-center">
              <div className="w-16 h-16 md:w-18 md:h-18 rounded-full bg-[#B0BBCA] flex items-center justify-center overflow-hidden">
                <img
                  src="/Profile2.png"
                  alt="프로필"
                  className="w-10 h-10 md:w-12 md:h-12 object-cover opacity-90"
                />
              </div>
            </div>

            {/* 오른쪽: 폼 */}
            <div className="w-full">
              <p className="mt-1 text-[14px] md:text-[15px] font-bold text-gray-900">
                기본정보
              </p>

              <div className="mt-4 space-y-4">
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

          {/* 저장 버튼 */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              className="min-w-[110px] px-4 py-2 rounded-full bg-[#2563eb] text-white text-[13px] md:text-[14px] font-bold"
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* 레이아웃 컴포넌트 */
function FieldRow({ label, children }) {
  return (
    <div className="grid grid-cols-[80px_1fr] items-center gap-4">
      <span className="text-[12px] md:text-[13px] text-gray-700 font-medium">
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
      className="w-full max-w-[340px] rounded-md border border-gray-300 outline-none px-3 py-1.5 text-[12px] md:text-[13px] focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
    />
  );
}
