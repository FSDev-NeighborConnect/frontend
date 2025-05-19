import { createContext, useContext, useState, useEffect } from "react"

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  // Initialize state from localStorage (or fallback to empty string)
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userId") || null
  })

  // Whenever userId changes, update localStorage accordingly
  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId)
    } else {
      localStorage.removeItem("userId")
    }
  }, [userId])

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
