// src/components/ChatBox.jsx
import { useEffect, useState, useRef } from "react";
import { sendMessage } from "../firebase/sendMessage";
import { listenToMessages } from "../firebase/listenToMessages";
import { startChat } from "../firebase/startChat";

export default function ChatBox({ currentUserId, targetUserId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    startChat(currentUserId, targetUserId).then((id) => {
      setChatId(id);
      const unsub = listenToMessages(id, setMessages);
      return () => unsub();
    });
  }, [currentUserId, targetUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(chatId, currentUserId, input.trim());
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col z-50">
      <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-100">
        <span className="font-semibold">Chat</span>
        <button onClick={onClose} className="text-xl font-bold hover:text-red-500">&times;</button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`text-sm px-3 py-2 rounded max-w-[80%] ${
              msg.senderId === currentUserId
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-gray-200 text-gray-900"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center border-t border-gray-200 p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
