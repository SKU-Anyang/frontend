import Header from "./assets/components/Header.jsx";
import Footer from "./assets/components/Footer";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1" />
      <Footer />
    </div>
  );
}