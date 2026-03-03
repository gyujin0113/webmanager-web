"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const TELEGRAM_BOT_TOKEN = "8461798262:AAGK2dNqh0U2hB1d-hFU1Zn8FseBCzmExQk";
const TELEGRAM_CHAT_ID = "1707030083";

async function sendTelegramNotification(data: {
  name: string;
  phone: string;
  message: string;
}) {
  const text = [
    "📩 *새로운 상담 문의*",
    "",
    `*성함:* ${data.name}`,
    `*연락처:* ${data.phone}`,
    `*요청사항:* ${data.message || "(없음)"}`,
  ].join("\n");

  await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "Markdown",
      }),
    }
  );
}

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FormData {
  name: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  message?: string;
}

const PHONE_REGEX = /^01[0-9]-?\d{3,4}-?\d{4}$/;

function validateField(
  field: keyof FormData,
  value: string,
): string | undefined {
  switch (field) {
    case "name":
      if (!value.trim()) return "성함을 입력해 주세요.";
      if (value.trim().length < 2) return "2자 이상 입력해 주세요.";
      return undefined;
    case "phone":
      if (!value.trim()) return "연락처를 입력해 주세요.";
      if (!PHONE_REGEX.test(value.replace(/\s/g, "")))
        return "올바른 전화번호를 입력해 주세요. (예: 010-1234-5678)";
      return undefined;
    case "message":
      return undefined;
  }
}

function validateAll(data: FormData): FormErrors {
  const errors: FormErrors = {};
  const nameErr = validateField("name", data.name);
  const phoneErr = validateField("phone", data.phone);
  const messageErr = validateField("message", data.message);
  if (nameErr) errors.name = nameErr;
  if (phoneErr) errors.phone = phoneErr;
  if (messageErr) errors.message = messageErr;
  return errors;
}

const inputClasses =
  "w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-4 py-3 min-h-[44px] text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/20 focus:outline-none transition-colors";

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
    name: false,
    phone: false,
    message: false,
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [honeypot, setHoneypot] = useState("");

  function handleChange(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleBlur(field: keyof FormData) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Honeypot check
    if (honeypot) return;

    const validationErrors = validateAll(formData);
    setErrors(validationErrors);
    setTouched({ name: true, phone: true, message: true });

    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "ea1b02ad-1a33-49e3-9dbe-f12f5c01d1eb",
          subject: "[WebManager] 새로운 상담 문의",
          from_name: "WebManager Contact Form",
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Telegram 알림 (실패해도 폼 전송은 성공 처리)
        sendTelegramNotification(formData).catch(() => {});
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function handleReset() {
    setFormData({ name: "", phone: "", message: "" });
    setErrors({});
    setTouched({ name: false, phone: false, message: false });
    setStatus("idle");
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle className="h-6 w-6 text-green-400" />
        </div>
        <h3 className="text-lg font-semibold">문의가 접수되었습니다</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          24시간 내에 연락드리겠습니다.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-6 text-sm text-brand-accent hover:underline cursor-pointer"
        >
          다른 문의하기
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 space-y-5"
    >
      {/* Honeypot */}
      <input
        type="text"
        name="botcheck"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setHoneypot(e.target.value)
        }
      />

      <div>
        <label
          htmlFor="contact-name"
          className="block text-sm font-medium mb-1.5"
        >
          성함 <span className="text-red-400">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          placeholder="홍길동"
          aria-required="true"
          aria-invalid={touched.name && !!errors.name}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          className={cn(
            inputClasses,
            touched.name && errors.name && "border-red-400/50",
          )}
        />
        {touched.name && errors.name && (
          <p
            id="contact-name-error"
            role="alert"
            aria-live="polite"
            className="mt-1.5 text-xs text-red-400"
          >
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="contact-phone"
          className="block text-sm font-medium mb-1.5"
        >
          연락처 <span className="text-red-400">*</span>
        </label>
        <input
          id="contact-phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
          placeholder="010-1234-5678"
          aria-required="true"
          aria-invalid={touched.phone && !!errors.phone}
          aria-describedby={errors.phone ? "contact-phone-error" : undefined}
          className={cn(
            inputClasses,
            touched.phone && errors.phone && "border-red-400/50",
          )}
        />
        {touched.phone && errors.phone && (
          <p
            id="contact-phone-error"
            role="alert"
            aria-live="polite"
            className="mt-1.5 text-xs text-red-400"
          >
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium mb-1.5"
        >
          요청사항
        </label>
        <textarea
          id="contact-message"
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          placeholder="원하시는 홈페이지 유형, 참고 사이트, 예산 등을 자유롭게 적어주세요."
          rows={4}
          aria-invalid={touched.message && !!errors.message}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          className={cn(
            inputClasses,
            "resize-none",
            touched.message && errors.message && "border-red-400/50",
          )}
        />
        {touched.message && errors.message && (
          <p
            id="contact-message-error"
            role="alert"
            aria-live="polite"
            className="mt-1.5 text-xs text-red-400"
          >
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <div
          className="flex items-center gap-2 text-sm text-red-400"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>전송에 실패했습니다. 잠시 후 다시 시도해 주세요.</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full inline-flex items-center justify-center rounded-lg px-8 py-3.5 text-sm font-medium bg-brand-accent text-white hover:bg-brand-accent-dark cursor-pointer transition-all duration-200 shadow-lg shadow-brand-accent/20 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            전송 중...
          </>
        ) : (
          "무료 상담 신청하기"
        )}
      </button>
    </form>
  );
}
