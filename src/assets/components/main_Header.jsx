import { Link } from "react-router-dom";

export default function MainHeader() {
  return (
    <header className="w-full bg-transparent absolute top-0 left-0">
      <div className="flex justify-between items-center h-28 px-20">
        {/* 왼쪽 */}
        <Link to="/" className="flex items-center">
          <img src="/logo_white.png" alt="로고" className="h-12" />
        </Link>

        {/* 오른쪽 */}
        <div className="flex items-center space-x-6 text-xl font-semibold text-white">
          <Link to="/mypage" className="hover:opacity-90">
            마이페이지
          </Link>
          <span className="opacity-90">|</span>
          <Link to="/login" className="hover:opacity-90">
            로그인
          </Link>
        </div>
      </div>

      <div className="w-full h-px bg-white/80"></div>
    </header>
  );
}
