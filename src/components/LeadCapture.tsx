"use client";

import { useEffect } from "react";
import { captureLead } from "@/lib/lead";

/**
 * Captures `?ref` / `?utm_*` into sessionStorage on first paint, then renders
 * nothing.
 *
 * A visitor arrives from a customer site's widget footer with attribution in the
 * query string; the moment they click an in-page anchor the query is still there
 * but the trial form may be mounted much later (and re-mounted on reset), so the
 * capture has to happen once, at the page level, independently of any form.
 */
export default function LeadCapture() {
  useEffect(() => {
    captureLead();
  }, []);

  return null;
}
