export default function Footer() {
  return (
<footer
  className="text-gray-600 text-[18px] py-20 relative"
  style={{ backgroundColor: "#BEC8D4" }} // 300보다 살짝 어둡게
>
        <div className="w-full flex justify-between items-start px-12 md:px-20">

        {/* 왼쪽 */}
        <div className="space-y-3">
          <p className="text-2xl">
            STARTIN
          </p>
          <p>주소: (14097) 경기도 안양시 만안구 성결대학로 53</p>
          <p>TEL: 031-467-8114</p>
        </div>

        {/* 오른쪽 메뉴 */}
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-700">개인정보처리방침</a>
          <span>|</span>
          <a href="#" className="hover:text-gray-700">공지사항</a>
          <span>|</span>
          <a href="#" className="hover:text-gray-700">Contact Us</a>
        </div>
      </div>

      {/* ✅ 완전 오른쪽 하단 */}
      <div className="absolute bottom-4 right-7">
        <p className="text-xl font-light">안.착@2025_v1</p>
      </div>
    </footer>
  );
}
