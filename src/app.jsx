// src/App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import First_Header from "./assets/components/First_Header.jsx";
import Back_Header from "./assets/components/Back_Header.jsx";
import Footer from "./assets/components/Footer.jsx";

import FirstScreen from "./pages/FirstScreen.jsx";
import SignUp from "./pages/SignUp.jsx";
import MyPage from "./pages/MyPage.jsx";
import Login from "./pages/Login.jsx";
import InfoEdit from "./pages/InfoEdit.jsx";

export default function App() {
  const { pathname } = useLocation();

  // 헤더/푸터 조건
  const showFirstHeader = pathname === "/";
  const showBackHeader  = pathname === "/mypage" || pathname === "/infoedit";
  const showFooter      = showFirstHeader || showBackHeader;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 조건부 해더 */}
      {showFirstHeader && <First_Header />}
      {showBackHeader && <Back_Header />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<FirstScreen />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/infoedit" element={<InfoEdit />} />

          {/* 대소문자 보정 */}
          <Route path="/Login" element={<Navigate to="/login" replace />} />
          <Route path="/MyPage" element={<Navigate to="/mypage" replace />} />
          <Route path="/SignUp" element={<Navigate to="/signup" replace />} />

          {/* 없는 경로 → 홈 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 메인/마이페이지/정보수정에서만 Footer */}
      {showFooter && <Footer />}
    </div>
  );
}
