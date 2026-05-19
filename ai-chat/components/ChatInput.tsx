"use client";

import { KeyboardEvent, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const submit = () => {
    const value = ref.current?.value.trim();
    if (!value || disabled) return;
    onSend(value);
    if (ref.current) ref.current.value = "";
  };

  return (
    <div className="border-t border-zinc-800 px-4 py-4">
      <div className="flex gap-2 max-w-3xl mx-auto">
        <Textarea
          ref={ref}
          placeholder="메시지를 입력하세요... (Enter 전송, Shift+Enter 줄바꿈)"
          className="resize-none bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 min-h-[52px] max-h-40"
          rows={1}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <Button
          onClick={submit}
          disabled={disabled}
          className="bg-zinc-600 hover:bg-zinc-500 text-white self-end"
        >
          전송
        </Button>
      </div>
    </div>
  );
}
