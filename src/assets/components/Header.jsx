import { NavLink, useNavigate } from "react-router-dom";

// 메뉴(클릭 시 이동할 페이지 경로 써주세요~)
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
    <header className="bg-white shadow w-full">
      <div className="relative flex items-center justify-center px-8 py-10">
        {/* 왼쪽 화살표 클릭 -> 메인("/") */}
        <button
          onClick={() => navigate("/")}
          className="absolute left-0 ml-12"
        >
          <img src="/arrow_left.png" alt="뒤로가기" className="w-7 h-7" />
        </button>

        {/* 메뉴 목록 */}
        <nav className="w-[70%] mx-auto">
          <ul className="flex items-center justify-between text-xl md:text-2xl">
            {MenuName.map((menu) => (
              <li key={menu.path}>
                <NavLink
                  to={menu.path}
                  className={({ isActive }) =>
                    isActive
                      ? "px-3 md:px-4 py-2 font-black text-black"  //선택된 메뉴가 눈에 잘 안 띄는것 같아요,, text-black이 tailwind 최댓값이라고해서 우선 요걸로 했습니다,,
                      : "px-3 md:px-4 py-2 text-gray-600 hover:text-gray-900"
                  }
                >
                  {menu.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="w-full h-px bg-gray-200"></div>
    </header>
  );
}