"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import { Message } from "@/types/chat";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);

  const handleSend = async (text: string) => {
    const userMessage: Message = { id: nanoid(), role: "user", content: text };
    const assistantId = nanoid();
    const assistantMessage: Message = { id: assistantId, role: "assistant", content: "" };

    const nextMessages = [...messages, userMessage];
    setMessages([...nextMessages, assistantMessage]);
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: accumulated } : m
          )
        );
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "오류가 발생했습니다. 다시 시도해주세요." }
            : m
        )
      );
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-lg font-semibold">AI Chat</h1>
        <p className="text-xs text-zinc-500">llama-4-scout-17b</p>
      </header>
      <ChatMessages messages={messages} streaming={streaming} />
      <ChatInput onSend={handleSend} disabled={streaming} />
    </div>
  );
}
