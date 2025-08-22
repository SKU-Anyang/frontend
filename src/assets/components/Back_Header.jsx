import { useNavigate } from "react-router-dom";

export default function Back_Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full absolute top-0 left-0 right-0 z-50">
      <div className="relative flex items-center justify-center px-8 py-14 bg-transparent">
        {/* 왼쪽 화살표 */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute left-12"
          aria-label="뒤로가기"
        >
          <img src="/arrow_left.png" alt="뒤로가기" className="w-9 h-9" />
        </button>
      </div>

      {/* 하단선 */}
      <div className="w-full h-px bg-[#A2A1A1]" />
    </header>
  );
}
