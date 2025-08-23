import { useNavigate } from "react-router-dom";

export default function Back_Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full h-20 border-b border-gray-300 bg-white/90 backdrop-blur">
      <div className="relative flex items-center justify-center h-full px-8">
        {/* 왼쪽 화살표 */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute left-8"
          aria-label="뒤로가기"
        >
          <img src="/arrow_left.png" alt="뒤로가기" className="w-9 h-9" />
        </button>
        <span className="text-lg font-semibold">뒤로가기</span>
      </div>
    </header>
  );
}
