import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useCsrf } from "../../context/CsrfContext"
import { apiUrl, apiConfigCsrf } from "../../utils/apiUtil"
import { useUser } from "../../context/UserContext"

const AdminMainDashboard = () => {
  const navigate = useNavigate()
  const { csrfToken, setCsrfToken } = useCsrf()
  const { setUserId } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleSignOut = async () => {
  try {
    await axios.post(
      apiUrl("api/logout"),
      {}, // Needed since it is a post request and needs to include a body
      apiConfigCsrf(csrfToken))

    // Clear client state only if logout is successful
    setUserId(null)
    setCsrfToken("")
    navigate("/admin/login")
  } catch (error) {
    console.error("Logout failed", error)

    // Still attempt to clean up client state on error
    setUserId(null)
    setCsrfToken("")
    navigate("/admin/login")
  }
}

  // Verify admin status
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await axios.get(
          apiUrl("api/users/currentUser"),
          apiConfigCsrf(csrfToken)
        )
        
        if (response.data.role === "admin") {
          setIsAdmin(true)
        } else {
          navigate("/admin/login")
        }
      } catch (error) {
        console.error("Admin verification failed:", error)
        navigate("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    verifyAdmin()
  }, [navigate, csrfToken])

  // If not admin (will redirect automatically)
  if (!isAdmin || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <button
        onClick={handleSignOut}
        className="absolute top-16 left-32 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Sign Out
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">Select a section to manage</p>
      </div>
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => navigate("/admin/dashboard-users")}
          className={"px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"}
        >
          Users
        </button>
        <button
          onClick={() => navigate("/admin/dashboard-posts")}
          className={"px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"}
        >
          Posts & Comments
        </button>
        <button
          onClick={() => navigate("/admin/dashboard-events")}
          className={"px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"}
        >
          Events
        </button>
        <button
          onClick={() => navigate("/admin/dashboard-statistics")}
          className={"px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"}
        >
          Statistics
        </button>
      </div>
    </div>
  )
}

export default AdminMainDashboard