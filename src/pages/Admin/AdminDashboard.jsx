import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useCsrf } from "../../context/CsrfContext"

const AdminMainDashboard = () => {
  const navigate = useNavigate()
  const { csrfToken } = useCsrf()
  const [isAdmin, setIsAdmin] = useState(false)

  // Verify admin status
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await axios.get("/api/users/currentUser", {
          withCredentials: true,
          headers: { "X-CSRF-Token": csrfToken }
        });
        
        if (response.data.role === "admin") {
          setIsAdmin(true)
        } else {
          navigate("/admin/login")
        }
      } catch (error) {
        console.error("Admin verification failed:", error)
        navigate("/admin/login")
      }
    }

    verifyAdmin()
  }, [navigate, csrfToken])

  // If not admin (will redirect automatically)
  if (!isAdmin) {
    return null
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
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
        onClick={() => navigate("/admin/dashboard-posts")} // Change to correct navigation
        className={"px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"}
      >
        Posts
      </button>
      <button
        onClick={() => navigate("/admin/dashboard-users")} // Change to correct navigation
        className={"px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"}
      >
        Statistics
      </button>
      </div>
    </div>
  )
}

export default AdminMainDashboard