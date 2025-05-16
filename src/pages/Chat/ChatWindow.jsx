import { useEffect, useState, useRef } from "react"
import { useUser } from "../../context/UserContext"
import { sendMessage } from "../../firebase/sendMessage"
import { listenToMessages } from "../../firebase/listenToMessages"
import { startChat } from "../../firebase/startChat"

export default function ChatBox({ targetUserId, targetUserName, targetUserAvatar, onClose }) {
  const { userId: currentUserId } = useUser()
  const [messages, setMessages] = useState([])
  const [chatId, setChatId] = useState(null)
  const [input, setInput] = useState("")
  const [isChatReady, setIsChatReady] = useState(false)
  const messagesEndRef = useRef(null)

  // Initialize chat
  useEffect(() => {
    if (!currentUserId || !targetUserId) return

    let unsubscribe = () => {}

    const setupChat = async () => {
      try {
        const id = await startChat(currentUserId, targetUserId)
        unsubscribe = listenToMessages(id, setMessages)
        setChatId(id)
        setIsChatReady(true)
      } catch (err) {
        console.error("Chat initialization error:", err)
      }
    }

    setupChat()

    return () => unsubscribe()
  }, [currentUserId, targetUserId])

  // Auto-scroll to new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !chatId) return
    
    try {
      await sendMessage(chatId, currentUserId, input.trim())
      setInput("")
    } catch (err) {
      console.error("Failed to send message:", err)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col z-50">
      {/* Header */}
      <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center gap-2 max-w-[calc(100%-40px)]">
          {targetUserAvatar ? (
            <img
              src={targetUserAvatar}
              alt={targetUserName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">
                {targetUserName?.[0] || '?'}
              </span>
            </div>
          )}
          <span className="font-medium text-gray-800 truncate">
            {targetUserName || `User ${targetUserId?.slice(0, 4)}`}
          </span>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          title="Close chat"
        >
          &times;
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded-lg max-w-[80%] text-sm ${
                msg.senderId === currentUserId
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 text-gray-800 mr-auto"
              }`}
            >
              {msg.text}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 p-4">
            Start your conversation with {targetUserName}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="bg-white flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          placeholder={`Message ${targetUserName}`}
          disabled={!isChatReady}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed w-fit"
          disabled={!input.trim() || !isChatReady}
        >
          Send
        </button>
      </div>
    </div>
  )
}
