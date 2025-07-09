import { useEffect, useRef } from "react";

export const useWebSocket = (url: string, onMessage: (data: any) => void) => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);
    ws.current.onmessage = (event) => {
      onMessage(JSON.parse(event.data));
    };
    return () => ws.current?.close();
  }, [url, onMessage]);

  return ws.current;
};
