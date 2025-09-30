# Netlify MCP Stocks (KRX/US)

Netlify Functions 위에 MCP HTTP Stream 서버를 구현해 **주식 아이디어 추천/체크**를 제공합니다.

## 1) 배포
1. 이 레포를 Codex/GitHub에 푸시 → Netlify 새 사이트 연결
2. 환경변수 설정
   - `FINNHUB_TOKEN`: Finnhub API Key
   - (선택) `MCP_BEARER`: Bearer 토큰(보안)
3. Deploy → 배포 URL 기준 엔드포인트
   - RPC:    `https://<site>.netlify.app/mcp`
   - Stream: `https://<site>.netlify.app/mcp/stream`

## 2) MCP 연결
- `mcp.manifest.json`를 퍼블릭으로 제공하고, 클라이언트에 등록
- Bearer 사용 시 Authorization 헤더로 전달

## 3) 테스트(cURL)
```bash
curl -X POST https://<site>.netlify.app/mcp  -H 'content-type: application/json'  -d '{
   "jsonrpc":"2.0","id":"1","method":"tools/call",
   "params": {"name":"recommend_stocks","arguments":{"universe":"KRX","n":6}}
 }'
```

## 4) 커스터마이징
- `src/tools/recommend.ts`의 유니버스/스코어 가중치 조정
- 섹터 상대강도/뉴스 센티먼트/갭업빈도 등 지표 확장
- Netlify Scheduled Functions로 08:45/09:30/15:30 KST 리포트 자동화

## 5) 면책
- 연구/교육용 예시 코드이며, 투자 판단의 책임은 본인에게 있습니다.