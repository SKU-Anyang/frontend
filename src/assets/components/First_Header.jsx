import { NavLink, Link, useNavigate } from "react-router-dom";

const MenuName = [
  { label: "아이디어/시장성 진단", path: "/IdeaRecommend" },
  { label: "비즈니스 설계/리스크 진단", path: "/BusinessDesignRisk" },
  { label: "유사 점포 분석", path: "/SimilarStores" },
  { label: "사장님 B2B 도우미", path: "/B2BHelper" },
  { label: "사용자 큐레이션", path: "/UserCuration" },
];

export default function First_Header() {
  const navigate = useNavigate();

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

        {/* 메뉴 */}
        <nav className="flex-1 mx-8">
          <ul className="flex items-center justify-around gap-6 font-medium text-[13px] text-gray-900">
            {MenuName.map((menu) => (
              <li key={menu.path}>
                <NavLink
                  to={menu.path}
                  className={({ isActive }) =>
                    isActive
                      ? "px-1 pb-1 font-semibold text-black border-b border-black"
                      : "px-1 pb-1 font-medium text-gray-900 hover:text-black hover:font-semibold transition-all"
                  }
                >
                  {menu.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* 오른쪽 (프로필, 로그인 버튼) */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/mypage" aria-label="마이페이지">
            <img
              src="/Profile.png"
              alt="프로필"
              className="w-8 h-8 rounded-full"
            />
          </Link>
        <button
          onClick={() => navigate("/login")}
          className="rounded-xl bg-[#7895CB] px-5 py-1.5 text-[13px] font-medium text-white shadow-md hover:opacity-95 active:translate-y-[1px] transition"
        >
          LOGIN
        </button>

        </div>
      </div>
    </header>
  );
}
