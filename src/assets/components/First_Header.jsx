import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";

const MenuName = [
  { label: "아이디어/시장성 진단", path: "/a" },
  { label: "비즈니스 설계/리스크 진단", path: "/business-design" },
  { label: "유사 점포 분석", path: "/similar-stores" },
  { label: "사장님 B2B 도우미", path: "/b2b-helper" },
  { label: "사용자 큐레이션", path: "/curation" },
];

// 저장된 토큰/유저 조회(로컬/세션 모두 확인)
function getToken() {
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
}
function getUser() {
  try {
    return (
      JSON.parse(localStorage.getItem("user") || "null") ||
      JSON.parse(sessionStorage.getItem("user") || "null")
    );
  } catch {
    return null;
  }
}

export default function First_Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [authed, setAuthed] = useState(!!getToken());
  const user = useMemo(() => getUser(), [authed, location.pathname]);

  // 라우트 변경/스토리지 변경/커스텀 이벤트에 따라 로그인 상태 동기화
  useEffect(() => {
    const sync = () => setAuthed(!!getToken());
    sync();
    window.addEventListener("storage", sync);        // 다른 탭 변화 대응
    window.addEventListener("auth-changed", sync);   // 같은 탭 강제 갱신(아래 Login 코드에서 발생)
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth-changed", sync);
    };
  }, [location.pathname]);

  const handleLogin = () => navigate("/login");

  const handleLogout = () => {
    // 토큰/유저 정보 제거
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("keepLogin");
    sessionStorage.removeItem("keepLogin");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    delete axios.defaults.headers.common["Authorization"];

    setAuthed(false);
    // 앱 전역에 상태 변경 알림
    window.dispatchEvent(new Event("auth-changed"));

    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full h-20 border-b border-gray-300 shadow-sm bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between px-8 py-4">
        {/* 로고 */}
        <div className="shrink-0">
          <Link to="/">
            <img src="/logo_black.png" alt="로고" className="w-28 h-auto" />
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

        {/* 오른쪽 (프로필, 로그인/로그아웃) */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/mypage" aria-label="마이페이지">
            <img src="/Profile.png" alt="프로필" className="w-8 h-8 rounded-full" />
          </Link>

          {authed ? (
            <>
              {/* 닉네임 보이기(선택) */}
              {user?.nickname && (
                <span className="text-[13px] text-gray-800">{user.userId}님</span>
              )}
              <button
                onClick={handleLogout}
                className="rounded-xl bg-[#7895CB] px-5 py-1.5 text-[13px] font-medium text-white shadow-md hover:opacity-95 active:translate-y-[1px] transition"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="rounded-xl bg-[#7895CB] px-5 py-1.5 text-[13px] font-medium text-white shadow-md hover:opacity-95 active:translate-y-[1px] transition"
            >
              LOGIN
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
