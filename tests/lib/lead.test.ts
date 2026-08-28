// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import {
  LEAD_STORAGE_KEY,
  captureLead,
  getLeadSnapshot,
  getServerLeadSnapshot,
  readLead,
  subscribeLead,
} from "@/lib/lead";

const EMPTY = { ref: "", utm_source: "", utm_medium: "", landing_path: "" };

beforeEach(() => {
  sessionStorage.clear();
});

describe("readLead", () => {
  it("returns empty strings when nothing was captured", () => {
    expect(readLead()).toEqual(EMPTY);
  });

  it("returns empty strings when the stored value is corrupt", () => {
    sessionStorage.setItem(LEAD_STORAGE_KEY, "{not json");
    expect(readLead()).toEqual(EMPTY);
  });

  it("ignores non-string stored fields", () => {
    sessionStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify({ ref: 42, utm_source: null }));
    expect(readLead()).toEqual(EMPTY);
  });
});

describe("captureLead", () => {
  it("stores ref, utm params and the landing path", () => {
    captureLead("?ref=grabis&utm_source=guide-widget&utm_medium=cta", "/");
    expect(readLead()).toEqual({
      ref: "grabis",
      utm_source: "guide-widget",
      utm_medium: "cta",
      landing_path: "/",
    });
  });

  it("does not overwrite a captured lead with an empty query", () => {
    captureLead("?ref=grabis&utm_source=guide-widget&utm_medium=cta", "/");
    captureLead("", "/somewhere-else");
    expect(readLead().ref).toBe("grabis");
    expect(readLead().landing_path).toBe("/");
  });

  it("keeps previously captured values when the new query is partial", () => {
    captureLead("?ref=grabis&utm_source=guide-widget&utm_medium=cta", "/");
    captureLead("?utm_medium=footer", "/pricing");
    expect(readLead()).toEqual({
      ref: "grabis",
      utm_source: "guide-widget",
      utm_medium: "footer",
      landing_path: "/pricing",
    });
  });

  it("writes nothing when there is no lead information at all", () => {
    captureLead("?foo=bar", "/");
    expect(sessionStorage.getItem(LEAD_STORAGE_KEY)).toBeNull();
    expect(readLead()).toEqual(EMPTY);
  });

  it("truncates oversized values", () => {
    captureLead(`?ref=${"a".repeat(500)}`, "/");
    expect(readLead().ref.length).toBeLessThanOrEqual(200);
  });

  it("ignores blank param values", () => {
    captureLead("?ref=%20%20&utm_source=guide-widget", "/");
    expect(readLead().ref).toBe("");
    expect(readLead().utm_source).toBe("guide-widget");
  });
});

describe("useSyncExternalStore binding", () => {
  it("returns a stable snapshot object while storage is unchanged", () => {
    captureLead("?ref=grabis", "/");
    expect(getLeadSnapshot()).toBe(getLeadSnapshot());
  });

  it("returns a new snapshot after a capture changes storage", () => {
    const before = getLeadSnapshot();
    captureLead("?ref=grabis", "/");
    expect(getLeadSnapshot()).not.toBe(before);
    expect(getLeadSnapshot().ref).toBe("grabis");
  });

  it("serves an empty lead as the server snapshot", () => {
    expect(getServerLeadSnapshot()).toEqual(EMPTY);
  });

  it("notifies subscribers when a lead is captured, and stops after unsubscribe", () => {
    let calls = 0;
    const unsubscribe = subscribeLead(() => {
      calls += 1;
    });

    captureLead("?ref=grabis", "/");
    expect(calls).toBe(1);

    unsubscribe();
    captureLead("?ref=other", "/");
    expect(calls).toBe(1);
  });
});
