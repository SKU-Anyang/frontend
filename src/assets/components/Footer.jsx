export default function Footer() {
  return (
    <footer className="bg-gray-300 text-gray-700 text-lg py-16">
      <div className="w-[70%] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

        {/* 왼쪽 */}
        <div className="space-y-3">
          <p className="font-semibold text-xl">안.착{" "}
            <span className="text-base text-gray-500">(안양 창업 착륙)</span>
          </p>
          <p className="text-lg">주소: (14097) 경기도 안양시 만안구 성결대학로 53</p>
          <p className="text-lg">TEL: 031-467-8114</p>
        </div>

        {/* 오른쪽 */}
        <div className="flex flex-col items-start md:items-end gap-3">
          <div className="flex gap-5 text-lg text-gray-600 font-semibold">
            <a href="#" className="hover:text-gray-900">개인정보처리방침</a>
            <span>|</span>
            <a href="#" className="hover:text-gray-900">공지사항</a>
            <span>|</span>
            <a href="#" className="hover:text-gray-900">Contact Us</a>
          </div>
          <p className="text-sm text-gray-500">안.착@2025_v1</p>
        </div>

      </div>
    </footer>
  );
}