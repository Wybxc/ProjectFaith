import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";
import type { Message } from "../server/bindings/Message";

interface ServerToClientEvents {
  "message-back": (message: Message) => void;
}

interface ClientToServerEvents {
  message: () => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.MODE === "development" ? "http://localhost:3003" : undefined,
);

export function useSocketEvent(
  event: keyof ServerToClientEvents,
  listener: ServerToClientEvents[keyof ServerToClientEvents],
) {
  useEffect(() => {
    socket.on(event, listener);

    return () => {
      socket.off(event, listener);
    };
  }, [event, listener]);
}
