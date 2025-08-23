// src/App.jsx
<<<<<<< HEAD
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
=======
import { Routes, Route } from "react-router-dom";
>>>>>>> f9d3f48cd1d5919d148d5fc0a19388617cbfff4a

import IdeaRecommend from "./pages/IdeaRecommend.jsx";
import IdeaResults from "./pages/IdeaResults.jsx";
import MarketInsights from "./pages/MarketInsights.jsx";
import BusinessDesignRisk from "./pages/BusinessDesignRisk.jsx";
import B2BHelper from "./pages/B2BHelper.jsx";
import SimilarStores from "./pages/SimilarStores.jsx";
import StoreDetail from "./pages/StoreDetail";
import MainSection from "./components/MainSection.jsx";
import UserCuration from "./pages/UserCuration.jsx";
// import Footer from "./assets/components/Footer.jsx";
export default function App() {
  return (
<<<<<<< HEAD
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
=======
    <>
      <main className="min-h-screen">
        
      <Routes>
        <Route path="/" element={<IdeaRecommend />} />
        <Route path="main-section" element={<MainSection />} />
        <Route path="/idea-results" element={<IdeaResults />} />
        <Route path="/market-insights" element={<MarketInsights />} />
        <Route path="/business-design" element={<BusinessDesignRisk />} />
        <Route path="/b2b-helper" element={<B2BHelper/>} />
        <Route path="/similar-stores" element={<SimilarStores />} />
        <Route path="/similar-stores/:id" element={<StoreDetail />} />
        <Route path="/curation" element={<UserCuration />} />
      </Routes>
      </main>
     
      </>
>>>>>>> f9d3f48cd1d5919d148d5fc0a19388617cbfff4a
  );
}
