import { ChevronRight, MessageSquare, Send, X } from "lucide-react";

/**
 * Static replica of the live guide widget's first screen, shown beside the Hero
 * copy so the product is visible before anyone clicks anything.
 *
 * Deliberately non-interactive (aria-hidden + pointer-events-none): the real,
 * clickable widget is already mounted bottom-right on this very page — this is
 * a picture of it, not a second instance. Colors mirror the widget's tokens
 * (navy #1e40af, see webmanager-widget styles.css), not the landing's CTA blue.
 */

const WIDGET_NAVY = "#1e40af";
/** color-mix(in oklab, #1e40af 80%, #000) — the widget header gradient's dark stop. */
const WIDGET_NAVY_DEEP = "#17307f";

const TABS = ["위젯", "가격·체험", "도입", "회사"];

const CHIPS = ["이 위젯이 뭔가요?", "챗GPT 같은 건가요?", "사이트가 느려지나요?"];

export default function WidgetPreview() {
  return (
    <div aria-hidden="true" className="pointer-events-none select-none flex flex-col items-center gap-3.5">
      <div className="flex h-[464px] w-[340px] flex-col overflow-hidden rounded-[18px] bg-white text-[#111827] shadow-[0_24px_64px_-16px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,0,0,0.05)]">
        {/* Header */}
        <div
          className="flex items-center gap-2.5 px-3.5 py-3 text-white"
          style={{ background: `linear-gradient(135deg, ${WIDGET_NAVY} 0%, ${WIDGET_NAVY_DEEP} 100%)` }}
        >
          <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-white/[0.18]">
            <MessageSquare className="h-[19px] w-[19px]" strokeWidth={2} />
          </span>
          <span className="min-w-0">
            <span className="block text-[13.5px] font-bold leading-tight">무엇을 도와드릴까요?</span>
            <span className="block text-[11px] leading-snug opacity-80">미리 준비한 답으로 바로 안내해드려요</span>
          </span>
          <span className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-white/[0.14]">
            <X className="h-[13px] w-[13px]" strokeWidth={2} />
          </span>
        </div>
        {/* Tabs */}
        <div className="flex gap-1.5 border-b border-[#111827]/[0.08] bg-white px-3 py-2">
          {TABS.map((tab, i) => (
            <span
              key={tab}
              className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] ${
                i === 0 ? "font-semibold text-white" : "bg-[#f3f4f6] font-medium text-[#374151]"
              }`}
              style={i === 0 ? { background: WIDGET_NAVY } : undefined}
            >
              {tab}
            </span>
          ))}
        </div>
        {/* Body */}
        <div className="flex flex-1 flex-col gap-2 overflow-hidden bg-[#f4f5f7] p-3">
          <p className="max-w-[90%] self-start rounded-[13px] rounded-bl-[4px] bg-white px-3 py-2 text-xs leading-normal shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            궁금한 걸 골라주세요. 답이 있는 곳으로 바로 데려다드릴게요.
          </p>
          <p className="px-0.5 pt-0.5 text-[10.5px] font-semibold tracking-wide text-[#6b7280]">자주 묻는 질문</p>
          <div className="flex flex-col overflow-hidden rounded-xl border border-[#111827]/[0.08] bg-white">
            {CHIPS.map((chip, i) => (
              <span
                key={chip}
                className={`flex min-h-10 items-center justify-between gap-1.5 py-2 pl-3 pr-2.5 text-xs leading-snug ${
                  i > 0 ? "border-t border-[#111827]/[0.08]" : ""
                }`}
              >
                {chip}
                <ChevronRight className="h-[13px] w-[13px] shrink-0 text-[#9ca3af]" strokeWidth={2} />
              </span>
            ))}
          </div>
        </div>
        {/* Input bar */}
        <div className="flex items-center gap-1.5 border-t border-[#111827]/[0.08] bg-white px-2.5 py-2">
          <span className="flex h-9 flex-1 items-center rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-3 text-xs text-[#9ca3af]">
            직접 질문하기 (예: 가격, 설치)
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e5e7eb] text-[#9ca3af]">
            <Send className="h-[15px] w-[15px]" strokeWidth={2} />
          </span>
        </div>
      </div>
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        실제 판매 중인 위젯과 같은 화면
      </p>
    </div>
  );
}
