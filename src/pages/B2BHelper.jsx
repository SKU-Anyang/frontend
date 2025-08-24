// src/pages/B2BHelper.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import searchIcon2 from "../assets/search2.png";

/* ============================
   페르소나(탭) 설정
============================ */
const PERSONAS = {
  strategy: {
    key: "strategy",
    label: "운영 전략",
    emoji: "📊",
    suggestions: [
      "원가율/인건비율 점검 포인트는?",
      "피크타임 회전율 올리는 방법은?",
      "메뉴별 공헌이익 관리 팁 알려줘",
      "재고/발주 표준 만들려면?",
    ],
  },
  sns: {
    key: "sns",
    label: "SNS 글쓰기",
    emoji: "✍️",
    suggestions: [
      "신메뉴 소개 글 카피 작성",
      "리뷰 이벤트 공지문 작성",
      "비 오는 날 감성 카피 3개",
      "네이버 블로그용 700자 글",
    ],
  },
  cs: {
    key: "cs",
    label: "고객 응대",
    emoji: "🤝",
    suggestions: [
      "환불 요구 들어왔을 때 멘트",
      "대기시간 길다고 화난 고객 응대",
      "예약 노쇼 방지 멘트",
      "부정 리뷰 대응 템플릿",
    ],
  },
};

/* ============================
   API 호출 (프록시 없이 직접)
============================ */
const API_BASE = "http://3.36.114.249:8080";

/** POST /api/ai/boss-assistant
 *  body: { storeName, category, task, context, tone }
 *  응답: text/plain 또는 application/json (둘 다 처리)
 */
async function callBossAssistant(context) {
  const res = await fetch(`${API_BASE}/api/ai/boss-assistant`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      storeName: "카페굿웨더",
      category: "카페",
      task: "리뷰 답변 문구 작성",
      context,
      tone: "친절하고 솔직",
    }),
  });

  const ctype = res.headers.get("content-type") || "";

  // 성공/실패 본문 읽기
  let payload;
  try {
    if (ctype.includes("application/json")) {
      payload = await res.json();
    } else {
      payload = await res.text(); // text/plain 등
    }
  } catch {
    payload = ""; // 본문이 없거나 파싱 실패
  }

  if (!res.ok) {
    // 에러 본문이 있으면 그대로 노출
    const msg =
      (typeof payload === "string" ? payload : payload?.message || payload?.error) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  // 통일된 형태로 반환: 문자열이면 그대로, JSON이면 적당히 추출
  if (typeof payload === "string") return payload;
  return (
    payload?.answer ??
    payload?.content ??
    payload?.message ??
    payload?.result ??
    JSON.stringify(payload)
  );
}

/* ============================
   페이지 컴포넌트
============================ */
export default function B2BHelper() {
  const [active, setActive] = useState("strategy"); // strategy | sns | cs
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // { role:'user'|'assistant', text, persona }
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const dateLabel = useMemo(() => {
    const d = new Date();
    const w = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${mm}. ${dd} (${w})`;
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || loading) return;

    const personaKey = active;

    setMessages((prev) => [...prev, { role: "user", text: trimmed, persona: personaKey }]);
    setInput("");
    setLoading(true);

    try {
      const answer = await callBossAssistant(trimmed);
      setMessages((prev) => [...prev, { role: "assistant", text: String(answer), persona: personaKey }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: `❌ 오류: ${e.message}`, persona: personaKey },
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
        <div className="mt-2 text-center text-xs text-gray-400">{dateLabel}</div>
      </div>

      {/* 채팅 영역 */}
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 sm:px-6 mt-4 mb-4">
        <div ref={chatRef} className="h-[65vh] sm:h-[70vh] px-2 sm:px-4 overflow-y-auto">
          {/* 웰컴 */}
          {messages.length === 0 && (
            <div className="flex gap-3 items-start">
              <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-lg select-none">🤖</div>
              <div className="text-sm text-gray-800 leading-6">
                {persona.emoji} <b>{persona.label}</b> 입니다. 무엇이 가장 궁금하세요?
              </div>
            </div>
          )}

          {/* 메시지 리스트 */}
          <div className="space-y-5 mt-2">
            {messages.map((m, i) => (
              <MessageBubble key={i} role={m.role} text={m.text} personaKey={m.persona} />
            ))}

            {loading && (
              <div className="flex gap-3 items-start">
                <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-lg select-none">🤖</div>
                <div className="px-4 py-2 rounded-2xl bg-gray-50 border text-sm text-gray-600">작성 중…</div>
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
              placeholder="리뷰/상황을 적어 주세요. (예: 디저트는 칭찬했지만 가격이 비싸다고 지적)"
              className="w-full min-h-[48px] max-h-32 rounded-full border bg-white px-5 py-3 pr-[84px] text-sm outline-none focus:ring-4 focus:ring-blue-100 resize-none"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-[55%] h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-40"
            >
              <img src={searchIcon2} alt="보내기" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================
   메시지 버블
============================ */
function MessageBubble({ role, text, personaKey }) {
  const isUser = role === "user";
  const color =
    personaKey === "strategy" ? "bg-blue-600"
      : personaKey === "sns" ? "bg-pink-600"
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
