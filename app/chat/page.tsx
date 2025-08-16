"use client";
import { RiSendPlaneFill } from "react-icons/ri";
import ChatUi from "./components/ChatUi";
import React, { useState } from "react";
import { z } from "zod";
import removeMd from "remove-markdown";
const inputSchema = z.object({
  message: z.string().min(1, "input cannot be empty"),
});

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // ✅ Validate input with zod
    const validation = inputSchema.safeParse({ message: input.trim() });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setLoading(true);

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    // Add empty assistant message placeholder (so we can live update it)
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "generating response..." },
    ]);

    const userInput = input; // preserve before clearing
    setInput("");

    try {
      const res = await fetch("/api/chat-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botReply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        let chunk = decoder.decode(value, { stream: true });
        botReply += removeMd(chunk);

        // 🔥 update last assistant message as it streams
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: botReply,
          };
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(120,119,198,0.3),rgba(255,255,255,0))] bg-black flex flex-col items-center justify-end p-6">
      <div className="w-full lg:w-[40%] h-full overflow-scroll relative py-4">
        {messages.length === 0 && (
          <div className="bg-gradient-to-b w-full absolute top-[50%]  left-[50%] -translate-x-[50%] from-[#908fa0dc] via-neutral-600 text-center to-neutral-900 bg-clip-text">
            <h3 className="text-6xl font-bold pb-12 text-transparent">
              Hi, how can I <br /> help you ?
            </h3>
          </div>
        )}
        {messages.map((message, idx) => (
          <div key={idx} className="text-neutral-100 font-extralight">
            {message.role === "user" ? (
              <div className="flex items-end gap-2 flex-col">
                <span className="font-bold text-2xl text-green-300">You</span>
                <h3 className="text-xl text-right mb-2 bg-neutral-800 border border-green-900 py-2 px-4 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl">
                  {message.content}
                </h3>
              </div>
            ) : (
              <div className="flex items-start gap-2 flex-col">
                <span className="font-bold text-2xl text-blue-300">AI</span>
                <h3 className="text-xl mb-2 bg-neutral-800 border border-blue-900 py-2 px-4 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl">
                  {message.content}
                </h3>
              </div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <p className="text-red-400 text-lg mb-2 font-medium   px-4">{error}</p>
      )}
      <form
        onSubmit={handleForm}
        className="border border-neutral-600/50 rounded-2xl bg-neutral-900/80 w-full lg:w-[650px] py-2 mb-24 flex items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Anything..."
          className="px-4 h-12 text-2xl outline-0 border-0 w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer disabled:opacity-50 active:bg-neutral-700 text-3xl bg-neutral-800 p-3 mr-3 rounded-2xl"
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"></div>
          ) : (
            <RiSendPlaneFill className="w-6 h-6" />
          )}
        </button>
      </form>
    </div>
  );
}
