import { useNavigate } from "react-router-dom";

export default function First_Header() {
  const navigate = useNavigate();

  return (
    <header
      className="w-full border-b border-gray-300 shadow-sm"
      style={{
        background: "radial-gradient(circle, #F9FAF8 0%, #C8D2DD 100%)",
      }}
    >
      <div className="flex items-center justify-between px-20 py-8">
        {/* 왼쪽 */}
        <div className="shrink-0">
          <button onClick={() => navigate("/")}>
            <img src="/logo.png" alt="로고" className="w-24 h-auto" />
          </button>
        </div>

        {/* 오른쪽 */}
        <div className="flex items-center gap-8 shrink-0">
          <button onClick={() => navigate("/mypage")}>
            <img
              src="/Profile.png"
              alt="프로필"
              className="w-12 h-12 rounded-full"
            />
          </button>

          <button
            onClick={() => navigate("/login")}
            className="rounded-full bg-[#7895CB] px-6 py-3 text-lg font-bold text-white shadow-lg hover:opacity-95 active:translate-y-[1px]"
          >
            LOGIN
          </button>
        </div>
      </div>

      <div className="w-full h-px bg-gray-300" />
    </header>
  );
}
