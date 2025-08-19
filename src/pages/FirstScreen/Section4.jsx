export default function Section4() {
  return (
    <section
      className="
        flex flex-col items-center justify-center text-center
        py-72 md:py-[400px]
      "
      style={{
        background: "radial-gradient(circle, #F9FAF8 0%, #C8D2DD 100%)",
      }}
    >
      <div className="text-2xl md:text-3xl font-bold leading-relaxed">
        <p>창업 이전부터, 창업 이후까지</p>
        <p>내 지역에 최적화된 창업을 AI가 설계하고,</p>
        <p>실패도 피하게 해주는</p>
        <p>풀 패키지 창업 AI 서비스</p>
      </div>

      <img
        src="/logo.png"
        alt="안착 로고"
        className="mt-10 w-32 md:w-40"
      />
    </section>
  );
}
