import { Link } from "react-router-dom";

export default function Main_Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-50 border-b border-gray-300 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between px-8 py-4">
        {/* 로고 */}
        <div className="shrink-0">
          <Link to="/">
            <img
              src="/logo_black.png"
              alt="로고"
              className="w-28 h-auto"
            />
          </Link>
        </div>


        {/* 오른쪽 */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/MyPage" aria-label="마이페이지" className="hover:opacity-90">
            <span className="text-sm font-medium text-white">마이페이지</span>
          </Link>
          <span className="opacity-70 text-sm">|</span>
          <Link to="/Login" aria-label="로그인" className="hover:opacity-90">
            <span className="text-sm font-medium text-white">로그인</span>
          </Link>
        </div>

      </div>
      
      {/* 하단선 */}
      <div className="w-full h-px bg-white/80" />
    </header>
  );
}