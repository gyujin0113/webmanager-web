"use client";

import { useCallback, useState } from "react";
import { WEB3FORMS_ACCESS_KEY } from "@/lib/formConfig";

export type FormSubmitStatus = "idle" | "submitting" | "success" | "error";

/** Which landing form the submission came from — decides the Telegram label. */
export type NotifyKind = "trial" | "contact";

export interface UseFormSubmitOptions {
  /** Email subject line sent to Web3Forms. */
  web3formsSubject: string;
  kind: NotifyKind;
}

export interface UseFormSubmitResult {
  status: FormSubmitStatus;
  error: string | null;
  submit: (fields: Record<string, string>) => Promise<void>;
  reset: () => void;
}

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const NOTIFY_ENDPOINT = "/api/notify";
const FROM_NAME = "WebManager Landing";
const GENERIC_ERROR = "전송에 실패했습니다. 잠시 후 다시 시도해 주세요.";

/**
 * Two-step submit: Web3Forms delivers the email (the record of truth), then the
 * `/api/notify` Pages Function pings Telegram. The notify call is best-effort —
 * if it fails (or is disabled because the secrets are not set yet), the user
 * still sees a success state because the email went through.
 */
export function useFormSubmit({
  web3formsSubject,
  kind,
}: UseFormSubmitOptions): UseFormSubmitResult {
  const [status, setStatus] = useState<FormSubmitStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (fields: Record<string, string>) => {
      setStatus("submitting");
      setError(null);

      try {
        const res = await fetch(WEB3FORMS_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: web3formsSubject,
            from_name: FROM_NAME,
            ...fields,
          }),
        });
        const data = (await res.json()) as { success?: boolean; message?: string };

        if (!data.success) {
          setError(data.message ?? GENERIC_ERROR);
          setStatus("error");
          return;
        }

        void notify(kind, fields);
        setStatus("success");
      } catch {
        setError(GENERIC_ERROR);
        setStatus("error");
      }
    },
    [web3formsSubject, kind],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return { status, error, submit, reset };
}

async function notify(kind: NotifyKind, fields: Record<string, string>): Promise<void> {
  try {
    await fetch(NOTIFY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, fields }),
    });
  } catch (err) {
    console.error("[useFormSubmit] notify failed", err);
  }
}
