import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useCsrf } from "../../context/CsrfContext.jsx"
import UserDetailModal from "./UserDetailModal.jsx"
import { apiUrl, apiConfigCsrf } from "../../utils/apiUtil.jsx"

const AdminDashboardUsers = () => {
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("members")
  const [selectedUser, setSelectedUser] = useState(null)
  const [groupByPostalCode, setGroupByPostalCode] = useState(false)
  const { csrfToken } = useCsrf()
  const navigate = useNavigate()
  const [currentAdminId, setCurrentAdminId] = useState(null)

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
          setCurrentAdminId(response.data.id)
          fetchUsers() // Only fetch users if admin
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

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        apiUrl("api/admin/all/users"),
        apiConfigCsrf(csrfToken)
      )
      setUsers(response.data)
    } catch (err) {
      setError(err.response?.status === 403 
        ? "Admin access required!" 
        : "Error fetching users!")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle user update
  const handleUpdate = (user) => {
    navigate("/admin/update-user", { state: { user } })
  }

  // Handle user delete
  const handleDelete = async (userId) => {
    try {
      // Prevent admin from deleting their own account
      if (userId === currentAdminId) {
        alert("You cannot delete your own admin account!")
        return
      }

      await axios.delete(
        apiUrl(`api/admin/users/${userId}`),
        apiConfigCsrf(csrfToken)
      )
      setUsers(users.filter((user) => user._id !== userId))
    } catch (err) {
      alert("Failed to delete user!")
    }
  }

  // Group users by postal code
  const memberUsers = users.filter(user => user.role === "member")
  const adminUsers = users.filter(user => user.role === "admin")
  
  const groupedByPostalCode = memberUsers.reduce((acc, user) => {
    const postal = user.postalCode || "Unknown"
    if (!acc[postal]) acc[postal] = []
    acc[postal].push(user)
    return acc
  }, {})

  // Loading state
  if (!isAdmin || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 sm:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-16 mt-8">
          <h1 className="text-3xl font-extrabold text-gray-900">User Management</h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
          >
            <svg 
              className="h-5 w-5 mr-4 text-color-gray-800"
              xmlns="http://www.w3.org/2000/svg"
              width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="#000000" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 16l-6-6 6-6"/><path d="M20 21v-7a4 4 0 0 0-4-4H5"/></svg>
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500 stroke-red-500 font-roboto"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24" height="24" viewBox="0 0 24 24"
                  fill="none" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={fetchUsers}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            <svg
              className="text-color-gray-800" 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" height="24" viewBox="0 0 24 24" 
              fill="none" stroke="#000000" strokeWidth="2" 
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
          </button>
          
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2 rounded ${activeTab === "members" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            Member Users
          </button>
          <button
            onClick={() => setActiveTab("admins")}
            className={`px-4 py-2 rounded ${activeTab === "admins" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            Admin Users
          </button>
          <button
            onClick={() => setGroupByPostalCode(prev => !prev)}
            className={`px-4 py-2 rounded ${groupByPostalCode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            {groupByPostalCode ? "Unsort by Postal Code" : "Sort by Postal Code"}
          </button>
          <button
            onClick={() => navigate("/admin/create-user")}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            + New User
          </button>
        </div>

        <div className="overflow-hidden bg-gray-50 shadow sm:rounded-lg">
          {activeTab === "admins" ? (
            <div>
              <h2 className="pt-4 pb-2 text-2xl text-center font-semibold mb-2 mt-2 text-gray-700">Admin Users</h2>
              {adminUsers.length === 0 ? (
                <p className="text-gray-500">No admin users found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {adminUsers.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className= "flex justify-center">
                              <button onClick={() => handleUpdate(user)} className="mr-4 text-blue-600 hover:text-blue-900">Update</button>
                              {/* Disable the delete button for the currently logged in admin user to prevent own account delete. */}
                              <button 
                                onClick={() => handleDelete(user._id)} 
                                className={`mr-4 ${user._id === currentAdminId ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'}`}
                                disabled={user._id === currentAdminId}
                              >
                                Delete
                              </button>
                              <button onClick={() => setSelectedUser(user)}className="mr-4 text-green-600 hover:text-green-900">View</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="pt-4 pb-2 text-2xl text-center font-semibold mb-2 mt-2 text-gray-700">Member Users</h2>
              {memberUsers.length === 0 ? (
                <p className="text-gray-500">No member users found.</p>
              ) : groupByPostalCode ? (
                Object.entries(groupedByPostalCode).map(([postalCode, users]) => (
                  <div key={postalCode} className="mb-6">
                    <h3 className="ml-6 text-lg font-semibold text-gray-700">Postal Code: {postalCode}</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex justify-center">
                                  <button onClick={() => handleUpdate(user)} className="mr-4 text-blue-600 hover:text-blue-900">Update</button>
                                  <button onClick={() => handleDelete(user._id)} className="mr-4 text-red-600 hover:text-red-900">Delete</button>
                                  <button onClick={() => setSelectedUser(user)} className="mr-4 text-green-600 hover:text-green-900">View</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {memberUsers.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex justify-center">
                              <button onClick={() => handleUpdate(user)} className="mr-4 text-blue-600 hover:text-blue-900">Update</button>
                              <button onClick={() => handleDelete(user._id)} className="mr-4 text-red-600 hover:text-red-900">Delete</button>
                              <button onClick={() => setSelectedUser(user)} className="mr-4 text-green-600 hover:text-green-900">View</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  )
}

export default AdminDashboardUsers
