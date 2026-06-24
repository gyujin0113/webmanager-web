#!/usr/bin/env bash
# 사용법: get-preview-url.sh <pagesProject> <branch> → 실제 프리뷰 alias URL 1줄 출력 (없으면 exit 1)
# push 직후 호출. 배포 생성 전이면 잠시 후 재시도.
set -euo pipefail
proj="$1"; branch="$2"
ACCOUNT=13237a3e8ed33b74e2737b57ab04505d
TOKEN=$(grep -m1 'oauth_token' ~/Library/Preferences/.wrangler/config/default.toml | sed 's/.*= *"\(.*\)"/\1/')
curl -s "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/pages/projects/${proj}/deployments?per_page=25" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -c "
import json,sys
branch=sys.argv[1]
for d in json.load(sys.stdin).get('result',[]):
    md=(d.get('deployment_trigger') or {}).get('metadata') or {}
    if md.get('branch')==branch:
        aliases=d.get('aliases') or []
        print(aliases[0] if aliases else d['url']); sys.exit(0)
sys.exit(1)
" "$branch"
