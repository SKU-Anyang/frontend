// src/App.jsx
import { Routes, Route } from "react-router-dom";
import IdeaRecommend from "./pages/IdeaRecommend.jsx";
import IdeaResults from "./pages/IdeaResults.jsx";
import MarketInsights from "./pages/MarketInsights.jsx";
import BusinessDesignRisk from "./pages/BusinessDesignRisk.jsx";
import B2BHelper from "./pages/B2BHelper.jsx";
import SimilarStores from "./pages/SimilarStores.jsx";
import StoreDetail from "./pages/StoreDetail";
import MainSection from "./components/MainSection.jsx";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<IdeaRecommend />} />
      <Route path="main-section" element={<MainSection />} />
      <Route path="/idea-results" element={<IdeaResults />} />
      <Route path="/market-insights" element={<MarketInsights />} />
      <Route path="/business-design" element={<BusinessDesignRisk />} />
      <Route path="b2b-helper" element={<B2BHelper/>} />
      <Route path="/similar-stores" element={<SimilarStores />} />
      <Route path="/similar-stores/:id" element={<StoreDetail />} />
    </Routes>
  );
}
