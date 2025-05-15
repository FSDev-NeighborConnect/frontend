import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { sendMessage } from "../../firebase/sendMessage"
import { listenToMessages } from "../../firebase/listenToMessages"
import { startChat } from "../../firebase/startChat"
import "./ChatBox.css"

export default function ChatBox({ targetUserId }) {
  const { targetUserId } = targetUserId // User to message
  const { currentUserId } = useUser() // Signed in user
  // const { targetAvatar } = useParams() // Get from URL like /chat/:targetUserId
  
  const navigate = useNavigate()

  const [messages, setMessages] = useState([])
  const [chatId, setChatId] = useState(null)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)

  useEffect(() => {
    console.log("currentUserId:", currentUserId)
    console.log("targetUserId:", targetUserId)

    if (!currentUserId || !targetUserId) {
      console.error("Missing IDs, cannot start chat")
      return
    }

    startChat(currentUserId, targetUserId)
      .then((id) => {
        console.log(":-) Chat ID from startChat:", id)
        setChatId(id)
        const unsub = listenToMessages(id, setMessages)
        return () => unsub() // Stop listening when component unmounts
      })
      .catch(err => {
        console.error(" X Error from startChat:", err)
      })
  }, [currentUserId, targetUserId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    if (!chatId) {
      alert("Chat not ready")
      return
    }

    await sendMessage(chatId, currentUserId, input.trim())
    setInput("")
  }

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <div className="chatbox-user-info">
      {/* <img
        src={targetAvatar}
        alt={targetUserId}
        className="chatbox-avatar"
      /> */}  
          <span className="chatbox-title">
            {targetUserId.charAt(0).toUpperCase() + targetUserId.slice(1)}
          </span>
        </div>
        <button
          onClick={() => navigate("/users")}
          className="chatbox-close"
          title="Close chat"
          >
          &times;
        </button>
      </div>
  
      <div className="chatbox-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chatbox-message ${msg.senderId === currentUserId ? "chatbox-message-sent" : "chatbox-message-received"}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbox-input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="chatbox-input"
          placeholder="Type a message"
        />
        <button
          onClick={handleSend}
          className="chatbox-send"
        >
          Send
        </button>
      </div>
    </div>
  )
}
