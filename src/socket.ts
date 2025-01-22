import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";
import type { CreateRoomResponse } from "../server/bindings/CreateRoomResponse";
import type { JoinRoom } from "../server/bindings/JoinRoom";

type Event<Request, Response> = (
  request: Request,
  callback: (response: Response) => void,
) => void;

interface ServerToClientEvents {
  dummy: () => void;
}

interface ClientToServerEvents {
  createRoom: Event<void, CreateRoomResponse>;
  joinRoom: Event<JoinRoom, void>;
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
