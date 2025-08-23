<<<<<<< HEAD
import { NavLink, Link, useNavigate } from "react-router-dom";

=======
import { NavLink, useNavigate } from "react-router-dom";

// 메뉴(클릭 시 이동할 페이지 경로 써주세요~)
>>>>>>> f9d3f48cd1d5919d148d5fc0a19388617cbfff4a
const MenuName = [
  { label: "아이디어/시장성 진단", path: "/idea" },
  { label: "비즈니스 설계/리스크 진단", path: "/business" },
  { label: "유사 점포 분석", path: "/analysis" },
  { label: "사장님 B2B 도우미", path: "/b2b" },
  { label: "사용자 큐레이션", path: "/curation" },
];

<<<<<<< HEAD
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
=======
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
>>>>>>> f9d3f48cd1d5919d148d5fc0a19388617cbfff4a
            {MenuName.map((menu) => (
              <li key={menu.path}>
                <NavLink
                  to={menu.path}
                  className={({ isActive }) =>
                    isActive
<<<<<<< HEAD
                      ? "px-2 py-1 font-bold text-black border-b-2 border-black"
                      : "px-2 py-1 text-gray-600 hover:text-gray-900"
=======
                      ? "px-3 md:px-4 py-2 font-black text-black"  //선택된 메뉴가 눈에 잘 안 띄는것 같아요,, text-black이 tailwind 최댓값이라고해서 우선 요걸로 했습니다,,
                      : "px-3 md:px-4 py-2 text-gray-600 hover:text-gray-900"
>>>>>>> f9d3f48cd1d5919d148d5fc0a19388617cbfff4a
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
<<<<<<< HEAD
      <div className="w-full h-px bg-gray-300" />
    </header>
  );
}
=======
      <div className="w-full h-px bg-gray-200"></div>
    </header>
  );
}
>>>>>>> f9d3f48cd1d5919d148d5fc0a19388617cbfff4a
