import { useState, useEffect, useCallback } from "react";
import { CONSOLE_MESSAGE } from "./constant";

interface Message {
  id: string;
  type: "log" | "error";
  value: string;
}

export const useConsole = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const clear = useCallback(() => {
    setMessages([]);
  }, []);

  const onMessage = useCallback((e: MessageEvent) => {
    const data = e.data;
    if (data.method === CONSOLE_MESSAGE)
      setMessages(m =>
        m.concat({
          id: Math.random()
            .toString(36)
            .slice(2),
          type: data.type,
          value: data.value
        })
      );
  }, []);

  useEffect(() => {
    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, [onMessage]);

  return {
    messages,
    clear
  };
};
