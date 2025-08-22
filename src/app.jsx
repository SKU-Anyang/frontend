import First_Header from "./assets/components/First_Header.jsx";
import Footer from "./assets/components/Footer.jsx";
import FirstScreen from "./pages/FirstScreen.jsx";
import SignUp from "./pages/SignUp.jsx";
import MyPage from "./pages/MyPage.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 상단 헤더 */}
      <First_Header />

      {/* 본문 */}
      <main className="flex-1">
        <FirstScreen />
        <SignUp/>
        <Login/>
        <MyPage/>
      </main>

      {/* 하단 푸터 */}
      <Footer />
    </div>
  );
}
