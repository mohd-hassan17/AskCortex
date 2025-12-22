import { useState, useCallback } from "react";

export function useStream() {
  const [isStreaming, setIsStreaming] = useState(false);

  const streamResponse = useCallback(
    async (
      res: Response,
      onToken: (token: string, fullText: string) => void
    ) => {
      if (!res.body) return;

      setIsStreaming(true);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullText += chunk;

        // Send chunk upward to UI
        onToken(chunk, fullText);
      }

      setIsStreaming(false);
    },
    []
  );

  return { streamResponse, isStreaming };
}
