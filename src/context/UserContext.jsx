import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { apiUrl, apiConfigCsrf } from "../utils/apiUtil"
import getCookie from "../utils/csrfUtil"

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const csrfToken = getCookie("csrfToken")
  const [userId, setUserId] = useState(null)
  const [loadingUser, setLoading] = useState(true)

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get(
        apiUrl("api/users/currentUser"),
        apiConfigCsrf(csrfToken))

      setUserId(res.data.id)
    } catch (error) {
      setUserId(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  return (
    <UserContext.Provider value={{
      userId,
      loadingUser,
      refetchUser: fetchCurrentUser
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)

