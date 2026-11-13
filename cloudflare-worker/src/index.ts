export interface Env {
  PRESENCE: DurableObjectNamespace;
  ALLOWED_ORIGINS: string;
}

const ROOM_NAME = 'global';
const PING = 'ping';
const PONG = 'pong';

export class PresenceRoom implements DurableObject {
  constructor(private readonly state: DurableObjectState) {
    this.state.setWebSocketAutoResponse(new WebSocketRequestResponsePair(PING, PONG));
  }

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Expected WebSocket upgrade', { status: 426 });
    }

    const [client, server] = Object.values(new WebSocketPair());
    this.state.acceptWebSocket(server);
    this.broadcastCount();

    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(): void {}

  webSocketClose(ws: WebSocket): void {
    try {
      ws.close();
    } catch {
      // Socket is already closed.
    }
    this.broadcastCount(ws);
  }

  webSocketError(ws: WebSocket): void {
    this.webSocketClose(ws);
  }

  private broadcastCount(closing?: WebSocket): void {
    const sockets = this.state.getWebSockets().filter((socket) => socket !== closing);
    const message = JSON.stringify({ type: 'count', count: sockets.length });
    for (const socket of sockets) {
      try {
        socket.send(message);
      } catch {
        // Ignore sockets that fail mid-send; they will emit a close event.
      }
    }
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== '/presence') {
      return new Response('Not found', { status: 404 });
    }

    const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim());
    if (!allowedOrigins.includes(request.headers.get('Origin') ?? '')) {
      return new Response('Forbidden', { status: 403 });
    }

    const stub = env.PRESENCE.get(env.PRESENCE.idFromName(ROOM_NAME));
    return stub.fetch(request);
  },
} satisfies ExportedHandler<Env>;
