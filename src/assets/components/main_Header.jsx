import { Link } from "react-router-dom";

export default function Main_Header() {
  return (
    <header className="w-full absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="flex justify-between items-center h-28 px-20">
        {/* 왼쪽 로고 */}
        <Link to="/" className="flex items-center">
          <img src="/logo_white.png" alt="로고" className="h-12" />
        </Link>

        {/* 오른쪽 메뉴 */}
        <div className="flex items-center space-x-6 text-xl font-semibold text-white">
          <Link to="/MyPage" className="hover:opacity-90">
            마이페이지
          </Link>
          <span className="opacity-90">|</span>
          <Link to="/Login" className="hover:opacity-90">
            로그인
          </Link>
        </div>
      </div>

      {/* 하단 선 */}
      <div className="w-full h-px bg-white/80" />
    </header>
  );
}
