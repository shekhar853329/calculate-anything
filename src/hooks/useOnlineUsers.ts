import { useEffect, useState } from 'react';

const PRESENCE_URL = import.meta.env.PUBLIC_PRESENCE_URL as string | undefined;
const HEARTBEAT_INTERVAL_MS = 25_000;
const MAX_RECONNECT_DELAY_MS = 30_000;

export function useOnlineUsers(): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!PRESENCE_URL) return;

    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let heartbeatTimer: ReturnType<typeof setInterval> | undefined;
    let attempt = 0;
    let disposed = false;

    const connect = () => {
      socket = new WebSocket(PRESENCE_URL);

      socket.onopen = () => {
        attempt = 0;
        heartbeatTimer = setInterval(() => {
          if (socket?.readyState === WebSocket.OPEN) socket.send('ping');
        }, HEARTBEAT_INTERVAL_MS);
      };

      socket.onmessage = (event) => {
        if (typeof event.data !== 'string') return;
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'count' && typeof message.count === 'number') {
            setCount(message.count);
          }
        } catch {
          // Ignore non-JSON frames such as the heartbeat "pong".
        }
      };

      socket.onclose = () => {
        clearInterval(heartbeatTimer);
        if (disposed) return;
        const delay = Math.min(1000 * 2 ** attempt, MAX_RECONNECT_DELAY_MS);
        attempt += 1;
        reconnectTimer = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      disposed = true;
      clearTimeout(reconnectTimer);
      clearInterval(heartbeatTimer);
      socket?.close();
    };
  }, []);

  return count;
}
