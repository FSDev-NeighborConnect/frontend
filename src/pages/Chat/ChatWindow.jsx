import { useEffect, useState, useRef } from "react"
import { useUser } from "../../context/UserContext"
import { sendMessage } from "../../firebase/sendMessage"
import { listenToMessages } from "../../firebase/listenToMessages"
import { startChat } from "../../firebase/startChat"
import "./ChatBox.css"

export default function ChatBox({ targetUserId, targetUserName, onClose }) { // Added targetUserName prop
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
    <div className="chatbox-container">
      <div className="chatbox-header">
        <div className="chatbox-user-info">
          <span className="chatbox-title">
            {targetUserName || `User ${targetUserId?.slice(0, 4)}`} {/* Show name or fallback */}
          </span>
        </div>
        <button 
          onClick={onClose}
          className="chatbox-close"
          title="Close chat"
        >
          &times;
        </button>
      </div>

      <div className="chatbox-messages">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`chatbox-message ${
                msg.senderId === currentUserId
                  ? "chatbox-message-sent"
                  : "chatbox-message-received"
              }`}
            >
              {msg.text}
            </div>
          ))
        ) : (
          <div className="chatbox-message chatbox-message-received">
            Start your conversation with {targetUserName}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbox-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="chatbox-input"
          placeholder={`Message ${targetUserName}`}
          disabled={!isChatReady}
        />
        <button
          onClick={handleSend}
          className="chatbox-send"
          disabled={!input.trim() || !isChatReady}
        >
          Send
        </button>
      </div>
    </div>
  )
}
