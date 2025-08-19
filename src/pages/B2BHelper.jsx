import React, { useEffect, useMemo, useRef, useState } from "react";
import searchIcon2 from "../assets/search2.png";
/**
 * B2BHelper — GPT 실시간 상담 (더미 응답 버전)
 * - 탭: 운영 전략 / SNS 글쓰기 도우미 / 고객 응대
 * - 각 탭마다 person(시스템 프롬프트), 추천 질문, 말풍선 스타일 분리
 * - TODO: OpenAI API 연동 지점 표시
 */

const PERSONAS = {
  strategy: {
    key: "strategy",
    label: "운영 전략",
    emoji: "📊",
    system:
      "당신은 소상공인 매장 운영 컨설턴트입니다. 매출 향상, 재고/인력/원가 최적화, 프로세스 개선을 실무적으로 제안하세요. 핵심 액션을 목록으로 명확히 제시합니다.",
    suggestions: [
      "어떤 고객층을 타겟으로 해야 할까요?",
      "가게 운영 시간/휴무일은 어떻게 정할까요?",
      "운영비용 절감할 팁이 있을까요?",
      "홍보 전략도 포함해야 하나요?",
    ],
    dummyAnswer: (q) =>
      [
        "1) **원가/인건비 점검**: 월별 손익표에서 원가율·인건비율 먼저 확인하세요.",
        "2) **회전율 향상**: 피크타임 좌석체류 60분→45분 목표. 테이크아웃 동선 분리.",
        "3) **메뉴별 공헌이익 관리**: 저마진 메뉴는 옵션 번들링으로 보완.",
        "4) **재고/발주**: 주간 발주표 + ABC 분류로 재고회전일 단축.",
        "5) **현장 오퍼레이션**: 오픈/마감 체크리스트 표준화 → 교육.",
      ].join("\n"),
  },
  sns: {
    key: "sns",
    label: "SNS 글쓰기 도우미",
    emoji: "✍️",
    system:
      "당신은 로컬 매장을 위해 SNS 카피를 작성하는 마케터입니다. 인스타그램/네이버 블로그에 쓸 글을 톤앤매너에 맞춰 짧고 임팩트 있게 제안하세요. 해시태그 포함.",
    suggestions: [
      "신메뉴 소개 글 카피 써줘",
      "리뷰 이벤트 공지문 작성해줘",
      "비 오는 날 감성 카피 3개",
      "네이버 블로그용 700자 글",
    ],
    dummyAnswer: (q) =>
      [
        "비 오는 날, 따뜻함이 필요한 순간 ☕️",
        "촉촉한 공기+고소한 향 = 완벽한 조합.",
        "오늘 한 잔의 여유, **라떼타운 범계**에서.",
        "",
        "#범계카페 #감성카페 #비오는날 #핫라떼 #퇴근길한잔",
      ].join("\n"),
  },
  cs: {
    key: "cs",
    label: "고객 응대",
    emoji: "🤝",
    system:
      "당신은 매장 CS 코치입니다. 어려운 상황의 고객 응대 멘트를 공감/해결 중심으로 제시하세요. 점주 입장 보호, 정책 안내, 대안 제시를 균형 있게.",
    suggestions: [
      "환불 요구가 들어왔을 때 멘트",
      "대기시간 길다고 화난 고객 응대",
      "예약 노쇼 방지 멘트",
      "리뷰 대응 템플릿(긍정/부정)",
    ],
    dummyAnswer: (q) =>
      [
        "불편을 드려 정말 죄송합니다.",
        "상황을 바로 확인해 도와드릴게요. 주문 번호를 알려주실 수 있을까요?",
        "가능한 빠르게 조치하고, 같은 일이 재발하지 않도록 개선하겠습니다.",
        "혹시 원하시면 교환 또는 부분 환불을 바로 도와드릴게요.",
      ].join("\n"),
  },
};

// 단순 더미 “지연 응답” 시뮬레이터
const fakeChatCompletion = async (personaKey, userText) => {
  const p = PERSONAS[personaKey];
  await new Promise((r) => setTimeout(r, 400));
  return p.dummyAnswer(userText);
};

export default function B2BHelper() {
  const [active, setActive] = useState("strategy"); // strategy | sns | cs
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // {role:'user'|'assistant', text, persona}
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  // 날짜 라벨용
  const dateLabel = useMemo(() => {
    const d = new Date();
    const w = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${mm}. ${dd} (${w})`;
  }, []);

  // 스크롤 따라가기
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    // 사용자 메시지 push
    setMessages((prev) => [...prev, { role: "user", text: trimmed, persona: active }]);
    setInput("");
    setLoading(true);

    try {
      // TODO: OpenAI API 연동
      // 예시:
      // const res = await openai.chat.completions.create({
      //   model: "gpt-4o-mini",
      //   messages: [
      //     { role: "system", content: PERSONAS[active].system },
      //     ...prevMessagesMapped,
      //     { role: "user", content: trimmed },
      //   ],
      //   temperature: 0.7,
      // });
      // const answer = res.choices[0].message.content;

      const answer = await fakeChatCompletion(active, trimmed);

      setMessages((prev) => [...prev, { role: "assistant", text: answer, persona: active }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "죄송합니다. 응답 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.",
          persona: active,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const persona = PERSONAS[active];

  return (
    <section className="min-h-screen bg-[#F6F8FB] flex flex-col">
      {/* 상단 바(간단) */}
      <div className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-3 flex items-center gap-4">
          <button title="뒤로" className="text-gray-600 hover:text-gray-900">←</button>
          <nav className="flex-1 flex items-center justify-center gap-10 text-sm text-gray-500">
            <span>아이디어/ 시장성 진단</span>
            <span className="font-semibold text-gray-900">사장님 B2B 도우미</span>
            <span>유사 점포 분석</span>
            <span>사용자 큐레이션</span>
          </nav>
        </div>
      </div>

      {/* 탭 + 날짜 */}
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 mt-4">
        <div className="flex items-center justify-center gap-2">
          {Object.values(PERSONAS).map((p) => (
            <button
              key={p.key}
              onClick={() => setActive(p.key)}
              className={`px-4 h-9 rounded-full text-sm border transition ${
                active === p.key
                  ? "bg-gray-100 border-gray-300 text-gray-900"
                  : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="mt-3 text-center text-xs text-gray-400">{dateLabel}</div>
      </div>

      {/* 채팅 영역 */}
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-6 mt-4 mb-4">
       {/* after */}
        <div
            ref={chatRef}
            className="h-[65vh] sm:h-[70vh] px-2 sm:px-4 overflow-y-auto"
        >

          {/* 웰컴 메시지 (탭별) */}
          {messages.length === 0 && (
            <div className="flex gap-3 items-start">
              <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-lg select-none">
                🤖
              </div>
              <div className="text-sm text-gray-800 leading-6">
                {persona.emoji} <b>{persona.label}</b> 입니다. 무엇이 가장 궁금하세요?
              </div>
            </div>
          )}

          {/* 대화 메시지 */}
          <div className="space-y-5 mt-2">
            {messages.map((m, i) => (
              <MessageBubble key={i} role={m.role} text={m.text} personaKey={m.persona} />
            ))}

            {loading && (
              <div className="flex gap-3 items-start">
                <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-lg select-none">
                  🤖
                </div>
                <div className="px-4 py-2 rounded-2xl bg-gray-50 border text-sm text-gray-600">
                  작성 중…
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 추천 질문 칩 */}
        <div className="mt-3 flex flex-wrap gap-2">
          {persona.suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(s)}
              className="inline-flex items-center gap-1 px-3 h-8 rounded-full bg-white border text-xs text-gray-700 hover:bg-gray-50"
            >
              {idx === 0 && "🔥"}
              {idx === 1 && "🕒"}
              {idx === 2 && "💡"}
              {idx === 3 && "📣"}
              {s}
            </button>
          ))}
        </div>

        {/* 입력창 */}
        <div className="mt-3">
          <div className="relative">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="매출 향상, 신메뉴 개발, 고객 유지 전략 등에 대한 운영 전략을 상담해 드려요."
              className="w-full min-h-[48px] max-h-32 rounded-full border bg-white px-5 py-3 pr-[84px] text-sm outline-none focus:ring-4 focus:ring-blue-100 resize-none"
            />
        <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-[55%] h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-40"
            >
            <img src= {searchIcon2} alt="보내기" className="h-5 w-5" />
        </button>

          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── sub components ───────── */

function MessageBubble({ role, text, personaKey }) {
  const isUser = role === "user";
  const color =
    personaKey === "strategy"
      ? "bg-blue-600"
      : personaKey === "sns"
      ? "bg-pink-600"
      : "bg-emerald-600";

  if (isUser) {
    return (
      <div className="flex items-start gap-3 justify-end">
        <div className={`px-4 py-2 rounded-2xl text-sm text-white ${color}`}>{text}</div>
        <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">👤</div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center">🤖</div>
      <div className="px-4 py-3 rounded-2xl bg-gray-50 border text-sm text-gray-800 whitespace-pre-wrap leading-6">
        {text}
      </div>
    </div>
  );
}
