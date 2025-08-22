import { NavLink, useNavigate } from "react-router-dom";

const MenuName = [
  { label: "아이디어/시장성 진단", path: "/idea" },
  { label: "비즈니스 설계/리스크 진단", path: "/business" },
  { label: "유사 점포 분석", path: "/analysis" },
  { label: "사장님 B2B 도우미", path: "/b2b" },
  { label: "사용자 큐레이션", path: "/curation" },
];

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full absolute top-0 left-0 right-0 z-50">
      <div className="relative flex items-center justify-center px-8 py-10 bg-transparent">
        {/* 왼쪽 화살표 클릭 -> 메인("/") */}
        <button
          onClick={() => navigate("/")}
          className="absolute left-0 ml-12"
          aria-label="뒤로가기"
        >
          <img src="/arrow_left.png" alt="뒤로가기" className="w-7 h-7" />
        </button>

        {/* 메뉴 */}
        <nav className="w-[70%] mx-auto">
          <ul className="flex items-center justify-between text-xl md:text-2xl">
            {MenuName.map((menu) => (
              <li key={menu.path}>
                <NavLink
                  to={menu.path}
                  className={({ isActive }) =>
                    isActive
                      ? "px-3 md:px-4 py-2 font-black text-black"
                      : "px-3 md:px-4 py-2 text-gray-600 hover:text-gray-900 hover:font-bold"
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
      <div className="w-full h-px bg-[#A2A1A1]" />
    </header>
  );
}
