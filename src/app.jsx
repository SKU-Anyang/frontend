// src/App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import First_Header from "./assets/components/First_Header.jsx";
import Header from "./assets/components/Header.jsx";   // ← 공통 헤더
import Footer from "./assets/components/Footer.jsx";

import FirstScreen from "./pages/FirstScreen.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import MyPage from "./pages/MyPage.jsx";
import InfoEdit from "./pages/InfoEdit.jsx";

export default function App() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더: 홈이면 First_Header, 아니면 Header */}
      {isHome ? <First_Header /> : <Header />}

      {/* 본문 (상단 패딩 없음, 헤더는 겹치도록 각 헤더 컴포넌트에서 absolute/fixed 사용) */}
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

      {/* Footer는 모든 페이지에 공통 */}
      <Footer />
    </div>
  );
}
