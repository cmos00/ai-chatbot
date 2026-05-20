import { groq } from "@/lib/groq";
import { Message } from "@/types/chat";

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const stream = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. Answer only what you know with confidence. If you are uncertain about a fact, clearly say so rather than guessing. Do not fabricate information.",
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
