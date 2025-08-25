import { NavLink, Link, useNavigate } from "react-router-dom";

const MenuName = [
  { label: "아이디어/시장성 진단", path: "/IdeaRecommend" },
  { label: "비즈니스 설계/리스크 진단", path: "/BusinessDesignRisk" },
  { label: "유사 점포 분석", path: "/SimilarStores" },
  { label: "사장님 B2B 도우미", path: "/B2BHelper" },
  { label: "사용자 큐레이션", path: "/UserCuration" },
];

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="absolute top-0 left-0 w-full z-50 border-b border-gray-300 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between px-8 py-4">
        {/* 왼쪽 화살표 클릭 -> 메인("/") */}
        <button
          onClick={() => navigate("/")}
          className="absolute left-0 ml-12"
        >
          <img src="/arrow_left.png" alt="뒤로가기" className="w-7 h-7" />
        </button>

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

      </div>
      
      {/* 하단선 */}
      <div className="w-full h-px bg-gray-200"></div>
    </header>
  );
}
