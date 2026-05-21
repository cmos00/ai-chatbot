# AI Chat App

Groq API를 사용하는 로컬 전용 AI 채팅 애플리케이션.

## Tech Stack

- **Framework**: Next.js 16+ (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: `groq-sdk` — `meta-llama/llama-4-scout-17b-16e-instruct`
- **Markdown**: `react-markdown` + `remark-gfm` + `rehype-highlight`

## Development

```bash
npm run dev      # 개발 서버 시작 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 실행
```

## Environment Variables

`.env.local` 파일에 설정 (git에 커밋하지 말 것):

```
GROQ_API_KEY=gsk_...
```

키 발급: [console.groq.com](https://console.groq.com) → API Keys

## Architecture

```
app/
  api/chat/route.ts       POST: 스트리밍 채팅 API 엔드포인트
  page.tsx                메인 채팅 UI — 메시지 상태 관리, 스트리밍 처리
  layout.tsx              루트 레이아웃
  globals.css             전역 스타일 + highlight.js 다크 테마

components/
  ChatMessage.tsx         메시지 버블 (user: 우측, assistant: 좌측 + 마크다운)
  ChatInput.tsx           입력창 (Enter 전송, Shift+Enter 줄바꿈)
  ChatMessages.tsx        스크롤 메시지 목록, 자동 스크롤

lib/
  groq.ts                 Groq 클라이언트 초기화
  utils.ts                Tailwind cn() 유틸리티

types/
  chat.ts                 Message 타입 정의 (id, role, content)
```

## Key Patterns

**스트리밍 흐름**
```
ChatInput → page.tsx (fetch POST /api/chat)
         → route.ts (groq.chat.completions.create, stream: true)
         → ReadableStream (delta.content 누적)
         → page.tsx (reader.read() 루프로 누적)
         → ChatMessage (실시간 렌더링)
```

**메시지 타입**
```ts
interface Message {
  id: string;       // nanoid()
  role: "user" | "assistant";
  content: string;
}
```

**모델 변경**: `app/api/chat/route.ts`의 `model` 값 수정
