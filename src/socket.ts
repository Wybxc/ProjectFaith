import { atom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";
import type {
  Auth,
  CreateRoom,
  CreateRoomResponse,
  JoinRoom,
  JoinRoomResponse,
} from "../server/bindings/types";
import { tokenAtom } from "./auth";

type Event<Request, Response> = (
  request: Request,
  callback: (response: Response) => void,
) => void;

interface ServerToClientEvents {
  dummy: () => void;
}

interface ClientToServerEvents {
  createRoom: Event<CreateRoom, CreateRoomResponse>;
  joinRoom: Event<JoinRoom, JoinRoomResponse>;
}

export const socketAtom = atom<Socket<
  ServerToClientEvents,
  ClientToServerEvents
> | null>((get) => {
  const token = get(tokenAtom);
  if (!token) return null;

  const endpoint =
    import.meta.env.MODE === "development"
      ? "http://localhost:3003"
      : undefined;

  return io(endpoint, {
    auth: { token } satisfies Auth,
    forceNew: true,
  });
});

export function useSocketEvent(
  event: keyof ServerToClientEvents,
  listener: ServerToClientEvents[keyof ServerToClientEvents],
) {
  const socket = useAtomValue(socketAtom);

  useEffect(() => {
    if (!socket) return;

    socket.on(event, listener);

    return () => {
      socket.off(event, listener);
    };
  }, [event, socket, listener]);
}
