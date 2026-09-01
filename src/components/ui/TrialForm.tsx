"use client";

import { useState, useSyncExternalStore, type ChangeEvent, type FormEvent } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { useSearchParam } from "@/hooks/useSearchParam";
import { getLeadSnapshot, getServerLeadSnapshot, subscribeLead } from "@/lib/lead";
import { inputClasses, submitButtonClasses } from "@/lib/formStyles";
import { TRIAL_DAYS } from "@/lib/pricing";
import {
  MESSAGE_MAX_LENGTH,
  normalizeSiteUrl,
  validateTrial,
  type TrialErrors,
  type TrialField,
  type TrialFields,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

interface TrialFormData {
  site: string;
  name: string;
  contact: string;
  mgmt: string;
}

/**
 * "지금 홈페이지 관리는 어떻게 하고 계세요?" — optional, and deliberately does not
 * ask for an amount. It only tells us how to phrase the install instructions
 * (and, off-landing, whether a management conversation makes sense at all).
 */
const MGMT_OPTIONS = [
  { value: "self", label: "직접 관리합니다" },
  { value: "agency", label: "제작업체에 맡기고 있어요" },
  { value: "none", label: "관리하고 있지 않아요" },
  { value: "unknown", label: "잘 모르겠어요" },
] as const;

const MGMT_HELPER_TEXT = "설치 안내에 참고합니다";

/** The widget's human fallback sends the unanswered question over as `?message=`. */
const PREFILL_PARAM = "message";

const EMPTY_FORM: TrialFormData = {
  site: "",
  name: "",
  contact: "",
  mgmt: "",
};

const LEAD_FIELDS = ["ref", "utm_source", "utm_medium", "landing_path"] as const;

const GENERIC_ERROR = "전송에 실패했습니다. 잠시 후 다시 시도해 주세요.";

export default function TrialForm() {
  const [formData, setFormData] = useState<TrialFormData>(EMPTY_FORM);
  // `null` = the visitor has not touched the memo yet, so the widget's fallback
  // prefill still owns the field.
  const [messageDraft, setMessageDraft] = useState<string | null>(null);
  const [errors, setErrors] = useState<TrialErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const lead = useSyncExternalStore(subscribeLead, getLeadSnapshot, getServerLeadSnapshot);
  const prefill = useSearchParam(PREFILL_PARAM);
  const message = messageDraft ?? prefill.slice(0, MESSAGE_MAX_LENGTH);

  const fields: TrialFields = { ...formData, message };

  const { status, error, submit, reset } = useFormSubmit({
    web3formsSubject: `[위젯 체험 신청] ${formData.site.trim() || "(주소 미입력)"}`,
    kind: "trial",
  });

  function handleChange(field: keyof TrialFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (submitted) setErrors(validateTrial({ ...fields, [field]: value }));
  }

  function handleMessageChange(value: string) {
    setMessageDraft(value);
    if (submitted) setErrors(validateTrial({ ...fields, message: value }));
  }

  function showError(field: TrialField): string | undefined {
    return submitted ? errors[field] : undefined;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (honeypot) return;

    setSubmitted(true);
    const validationErrors = validateTrial(fields);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    await submit({
      // Send the normalized form so the follow-up notification has a clickable URL.
      site: normalizeSiteUrl(formData.site) ?? formData.site.trim(),
      name: formData.name.trim(),
      contact: formData.contact.trim(),
      mgmt: formData.mgmt,
      message: message.trim(),
      ...lead,
    });
  }

  function handleReset() {
    setFormData(EMPTY_FORM);
    setMessageDraft("");
    setErrors({});
    setSubmitted(false);
    reset();
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-[clamp(2rem,5vh,2.5rem)] text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle className="h-6 w-6 text-green-400" />
        </div>
        <h3 className="text-lg font-semibold">체험 신청이 접수되었습니다</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          24시간 안에 연락드립니다. 그동안 우하단 버튼을 눌러보세요.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-6 text-sm text-brand-accent hover:underline cursor-pointer"
        >
          다른 사이트도 신청하기
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-[clamp(1rem,2.5vh,2rem)] space-y-[clamp(0.75rem,2.2vh,1.25rem)]"
    >
      {/* 폼 이탈 방지 마이크로카피 — 시작 전에 총량을 알려준다. */}
      <p className="text-xs font-semibold text-brand-accent">
        필수 입력은 3칸 — 1분이면 끝납니다
      </p>

      {/* Honeypot */}
      <input
        type="text"
        name="botcheck"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setHoneypot(e.target.value)}
      />

      {/* Referral / UTM attribution captured on arrival */}
      {LEAD_FIELDS.map((field) => (
        <input key={field} type="hidden" name={field} value={lead[field]} readOnly />
      ))}

      {/*
        데스크톱(lg 이상)에서는 짧은 두 필드를 한 줄로 접어 폼 높이를 줄인다.
        필드·라벨·id·검증은 그대로고 배치만 바뀐다.
      */}
      <div className="grid gap-[clamp(0.875rem,2.2vh,1.25rem)] lg:grid-cols-2 lg:items-start">
        <div>
          <label htmlFor="trial-site" className="block text-sm font-medium mb-1.5">
            홈페이지 주소 <span className="text-red-400">*</span>
          </label>
          <input
            id="trial-site"
            type="text"
            inputMode="url"
            autoComplete="url"
            value={formData.site}
            onChange={(e) => handleChange("site", e.target.value)}
            placeholder="example.co.kr"
            aria-required="true"
            aria-invalid={!!showError("site")}
            aria-describedby={showError("site") ? "trial-site-error" : undefined}
            className={cn(inputClasses, showError("site") && "border-red-400/50")}
          />
          {showError("site") && (
            <p
              id="trial-site-error"
              role="alert"
              className="mt-1.5 text-xs text-red-400"
            >
              {errors.site}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="trial-name" className="block text-sm font-medium mb-1.5">
            회사명 / 성함 <span className="text-red-400">*</span>
          </label>
          <input
            id="trial-name"
            type="text"
            autoComplete="organization"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="쓰리앤디 / 홍길동"
            aria-required="true"
            aria-invalid={!!showError("name")}
            aria-describedby={showError("name") ? "trial-name-error" : undefined}
            className={cn(inputClasses, showError("name") && "border-red-400/50")}
          />
          {showError("name") && (
            <p
              id="trial-name-error"
              role="alert"
              className="mt-1.5 text-xs text-red-400"
            >
              {errors.name}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="trial-contact" className="block text-sm font-medium mb-1.5">
          연락처 <span className="text-red-400">*</span>
        </label>
        <input
          id="trial-contact"
          type="text"
          value={formData.contact}
          onChange={(e) => handleChange("contact", e.target.value)}
          placeholder="010-1234-5678 또는 name@example.com"
          aria-required="true"
          aria-invalid={!!showError("contact")}
          aria-describedby={showError("contact") ? "trial-contact-error" : undefined}
          className={cn(inputClasses, showError("contact") && "border-red-400/50")}
        />
        {showError("contact") && (
          <p
            id="trial-contact-error"
            role="alert"
            className="mt-1.5 text-xs text-red-400"
          >
            {errors.contact}
          </p>
        )}
      </div>

      {/*
        라디오 2×2 는 폼 전체 폭이 있어야 라벨이 한 줄로 들어간다. 반 폭 칸에 넣으면
        "제작업체에 맡기고 있어요" 가 서너 줄로 깨지므로, 이 블록만 전체 폭으로 둔다.
      */}
      <fieldset>
        <legend className="block text-sm font-medium mb-1.5">
          지금 홈페이지 관리는 어떻게 하고 계세요?
        </legend>
        <p className="mb-2 text-xs text-muted-foreground">{MGMT_HELPER_TEXT}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {MGMT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 min-h-[44px] text-sm cursor-pointer transition-colors",
                formData.mgmt === option.value
                  ? "border-brand-accent/50 bg-brand-accent/10"
                  : "border-white/[0.08] bg-white/[0.03] hover:border-white/20",
              )}
            >
              <input
                type="radio"
                name="mgmt"
                value={option.value}
                checked={formData.mgmt === option.value}
                onChange={(e) => handleChange("mgmt", e.target.value)}
                className="h-4 w-4 shrink-0 accent-brand-accent"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="trial-message" className="block text-sm font-medium mb-1.5">
          메모
        </label>
        <textarea
          id="trial-message"
          value={message}
          onChange={(e) => handleMessageChange(e.target.value)}
          placeholder="방문자가 자주 묻는 질문, 안내하고 싶은 페이지 등을 자유롭게 적어주세요."
          rows={3}
          maxLength={MESSAGE_MAX_LENGTH}
          aria-invalid={!!showError("message")}
          aria-describedby={showError("message") ? "trial-message-error" : undefined}
          className={cn(inputClasses, "resize-none", showError("message") && "border-red-400/50")}
        />
        <p className="mt-1.5 text-right text-xs text-muted-foreground">
          {message.length} / {MESSAGE_MAX_LENGTH}
        </p>
        {showError("message") && (
          <p
            id="trial-message-error"
            role="alert"
            className="mt-1.5 text-xs text-red-400"
          >
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-400" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error ?? GENERIC_ERROR}</p>
        </div>
      )}

      <button type="submit" disabled={status === "submitting"} className={submitButtonClasses}>
        {status === "submitting" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            전송 중...
          </>
        ) : (
          `${TRIAL_DAYS}일 무료로 달아보기`
        )}
      </button>
      <p className="!mt-2.5 text-center text-[11px] text-muted-foreground">
        24시간 안에 연락드립니다
      </p>
    </form>
  );
}
