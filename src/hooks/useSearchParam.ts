"use client";

import { useCallback, useSyncExternalStore } from "react";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("popstate", onChange);
  window.addEventListener("hashchange", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("hashchange", onChange);
  };
}

/**
 * Reads a single query-string parameter.
 *
 * The query string is browser-only state that does not exist during the static
 * prerender, so this goes through `useSyncExternalStore`: the server snapshot is
 * `""` and the real value arrives right after hydration, with no setState in an
 * effect and no hydration mismatch.
 */
export function useSearchParam(name: string): string {
  const getSnapshot = useCallback(
    () => new URLSearchParams(window.location.search).get(name) ?? "",
    [name],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => "");
}
