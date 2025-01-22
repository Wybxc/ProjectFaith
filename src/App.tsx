import { useState } from "react";
import type { Message } from "../server/bindings/Message.ts";
import { socket, useSocketEvent } from "./socket.ts";

const App = () => {
  const [messages, setMessages] = useState<{ msg: string; id: number }[]>([]);
  useSocketEvent("message-back", (message: Message) => {
    setMessages((prevMessages) => {
      const id = prevMessages.length
        ? prevMessages[prevMessages.length - 1].id + 1
        : 0;
      return [...prevMessages, { msg: message.message, id }];
    });
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Messages</h1>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.msg}</li>
        ))}
      </ul>
      <button
        type="button"
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        onClick={() => {
          socket.emit("message");
        }}
      >
        Send message
      </button>
    </div>
  );
};

export default App;
