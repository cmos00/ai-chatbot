import { groq } from "@/lib/groq";
import { KNOWLEDGE_BASE, isKakaoRelated } from "@/lib/knowledge";
import { Message } from "@/types/chat";

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const lastUserMessage = messages.findLast((m) => m.role === "user")?.content ?? "";
  const kakaoContext = isKakaoRelated(lastUserMessage)
    ? `\n\n## 참고 지식 (신뢰할 수 있는 정보):\n${KNOWLEDGE_BASE}`
    : "";

  const stream = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. Follow these rules strictly:\n" +
          "1. If '참고 지식' is provided above, use it as the authoritative source for those facts.\n" +
          "2. Only state facts you are highly confident about.\n" +
          "3. For Korean company details not covered in the reference knowledge, say '정확하지 않을 수 있습니다' or recommend checking official sources.\n" +
          "4. Never fabricate names, dates, or numbers. If unsure, say so.\n" +
          "5. For events after early 2024, acknowledge your knowledge cutoff." +
          kakaoContext,
      },
      ...messages.map(({ role, content }) => ({ role, content })),
    ],
    stream: true,
  });

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) {
          controller.enqueue(new TextEncoder().encode(text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
