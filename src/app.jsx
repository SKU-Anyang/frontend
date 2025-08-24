// src/app.jsx
import { Routes, Route } from "react-router-dom";

// 헤더/푸터 (assets/components 폴더)
import First_Header from "./assets/components/First_Header.jsx";
import Footer from "./assets/components/Footer.jsx";

// 페이지 (src/pages 폴더)
import FirstScreen from "./pages/FirstScreen.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import MyPage from "./pages/MyPage.jsx";
import InfoEdit from "./pages/InfoEdit.jsx";

import IdeaRecommend from "./pages/IdeaRecommend.jsx";
import IdeaResults from "./pages/IdeaResults.jsx";
import MarketInsights from "./pages/MarketInsights.jsx";
import BusinessDesignRisk from "./pages/BusinessDesignRisk.jsx";
import B2BHelper from "./pages/B2BHelper.jsx";
import SimilarStores from "./pages/SimilarStores.jsx";
import StoreDetail from "./pages/StoreDetail.jsx"; // ← .jsx 확장자까지!
import UserCuration from "./pages/UserCuration.jsx";

// 컴포넌트 (src/components 폴더)
import MainSection from "./components/MainSection.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 상단 공용 헤더 */}
      <First_Header />

      {/* 본문 */}
      <main className="flex-1">
        <Routes>
          {/* 랜딩/기본 페이지들 */}
          <Route path="/" element={<FirstScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/infoedit" element={<InfoEdit />} />

          {/* 기능 페이지들 */}
          <Route path="/idea" element={<IdeaRecommend />} />
          <Route path="/idea-results" element={<IdeaResults />} />
          <Route path="/market-insights" element={<MarketInsights />} />
          <Route path="/business-design" element={<BusinessDesignRisk />} />
          <Route path="/b2b-helper" element={<B2BHelper />} />
          <Route path="/similar-stores" element={<SimilarStores />} />
          <Route path="/similar-stores/:id" element={<StoreDetail />} />
          <Route path="/main-section" element={<MainSection />} />
          <Route path="/curation" element={<UserCuration />} />
        </Routes>
      </main>

      {/* 하단 공용 푸터 */}
      <Footer />
    </div>
  );
}
