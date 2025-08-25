// src/assets/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-[#BEC8D4] text-gray-500 text-xs">
      <div className="relative w-[95%] mx-auto grid grid-cols-[1fr_auto] min-h-28 py-10">
        
        {/* 🔹 왼쪽 */}
        <div className="justify-self-start space-y-1 text-left">
          <p className="text-[12px] font-medium">STARTIN</p>
          <p className="text-[11px] font-medium">
            주소: (14097) 경기도 안양시 만안구 성결대학로 53
          </p>
          <p className="text-[11px] font-medium">TEL: 031-467-8114</p>
        </div>

        {/* 🔹 오른쪽 (상단 메뉴만) */}
        <div className="justify-self-end flex gap-2 text-[11px] font-medium">
          <a href="#" className="hover:text-gray-700">개인정보처리방침</a>
          <span>|</span>
          <a href="#" className="hover:text-gray-700">공지사항</a>
          <span>|</span>
          <a href="#" className="hover:text-gray-700">Contact Us</a>
        </div>

        {/* 🔹 오른쪽 하단 버전 (살짝 바깥쪽으로 이동) */}
        <p className="absolute bottom-2 -right-4 text-[10px] font-light">
          STARTIN@2025_v1
        </p>
        
      </div>
    </footer>
  );
}
