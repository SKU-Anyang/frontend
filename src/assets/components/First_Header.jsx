import { NavLink, Link, useNavigate } from "react-router-dom";

const MenuName = [
  { label: "아이디어/시장성 진단", path: "/idea" },
  { label: "비즈니스 설계/리스크 진단", path: "/business" },
  { label: "유사 점포 분석", path: "/analysis" },
  { label: "사장님 B2B 도우미", path: "/b2b" },
  { label: "사용자 큐레이션", path: "/curation" },
];

export default function First_Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full h-20 border-b border-gray-300 shadow-sm bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between px-20 h-full">
        {/* 로고 */}
        <Link to="/" className="shrink-0">
          <img src="/logo_black.png" alt="로고" className="w-48 h-auto" />
        </Link>

        {/* 메뉴 */}
        <nav className="flex-1 mx-16">
          <ul className="flex items-center justify-around gap-12 font-semibold text-lg md:text-2xl">
            {MenuName.map((menu) => (
              <li key={menu.path}>
                <NavLink
                  to={menu.path}
                  className={({ isActive }) =>
                    isActive
                      ? "px-2 py-1 font-bold text-black border-b-2 border-black"
                      : "px-2 py-1 text-gray-600 hover:text-gray-900"
                  }
                >
                  {menu.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* 오른쪽 (프로필, 로그인 버튼) */}
        <div className="flex items-center gap-8 shrink-0">
          <Link to="/mypage" aria-label="마이페이지">
            <img
              src="/Profile.png"
              alt="프로필"
              className="w-12 h-12 rounded-full"
            />
          </Link>
          <button
            onClick={() => navigate("/login")}
            className="rounded-full bg-[#7895CB] px-6 py-3 text-lg font-bold text-white shadow-lg hover:opacity-95 active:translate-y-[1px]"
          >
            LOGIN
          </button>
        </div>
      </div>
    </header>
  );
}
