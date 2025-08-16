"use client";
import { useState } from "react";

export default function ChatUi() {
  const [input, setInput] = useState("");
 

  return (
    <main className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat with Gemma (Free)</h1>
      <div className="border p-2 rounded h-96 overflow-y-auto mb-2">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-blue-500" : "text-green-500"}>
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </main>
  );
}
