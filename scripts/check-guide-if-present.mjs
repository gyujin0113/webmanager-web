#!/usr/bin/env node
// postbuild 가드: sync-guide.mjs 가 만든 public/guide.json (가격 치환 완료본) 의 딥링크가
// 방금 만든 out/ 에 실제로 존재하는지 검증한다. content/guide.json 은 {{price}} 같은
// placeholder를 그대로 들고 있어 검증 대상이 아니다 — 반드시 치환이 끝난 public/guide.json 을 본다.
//
// 검증기는 형제 repo(webmanager-widget)의 빌드 산출물이라 로컬에만 있다. Cloudflare Pages CI 는
// 이 repo 만 체크아웃하므로 검증기가 없다 — 그 경우 빌드를 깨뜨리지 않고 건너뛴다.
// 즉 이 가드의 보증 범위는 "로컬 npm run build + /apply-edit 가드레일"이며, CI 빌드는 미보증이다.
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const VALIDATOR = resolve(root, "../webmanager-widget/dist/validate-guide.mjs");

export function checkGuide(validator = VALIDATOR, cwd = root) {
  if (!existsSync(validator)) {
    console.log("ℹ️  guide validator not found — skipping (CI/Pages)");
    return 0;
  }
  const res = spawnSync(process.execPath, [validator, "public/guide.json", "out"], { cwd, stdio: "inherit" });
  // spawn 자체가 실패하면(권한·ENOENT) 조용히 통과시키지 않고 실패로 본다.
  if (res.error) {
    console.error("❌  guide validator failed to run:", res.error.message);
    return 1;
  }
  return res.status ?? 1;
}

if (process.argv[1] && process.argv[1].endsWith("check-guide-if-present.mjs")) {
  process.exit(checkGuide());
}
