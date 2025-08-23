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
    <header className="absolute top-0 left-0 w-full z-50 border-b border-gray-300 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between px-20 py-11">{/* ⬅️ 높이 up */}
        {/* 왼쪽 화살표 (홈으로) */}
        <button
          onClick={() => navigate("/")}
          className="shrink-0"
          aria-label="뒤로가기"
        >
          <img src="/arrow_left.png" alt="뒤로가기" className="w-9 h-9" />
        </button>

        {/* 메뉴 */}
        <nav className="flex-1 mx-16">
          <ul className="flex items-center justify-around gap-14 font-semibold md:text-2xl">
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
      </div>

      {/* 하단선 */}
      <div className="w-full h-px bg-gray-300" />
    </header>
  );
}
