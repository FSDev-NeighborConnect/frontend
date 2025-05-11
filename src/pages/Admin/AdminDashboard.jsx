import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useCsrf } from "../../context/CsrfContext.jsx"
import UserDetailModal from "./UserDetailModal.jsx"

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Track authentication status
  const { csrfToken } = useCsrf()
  const [userRole, setUserRole] = useState(null) // Track user role (admin or not)
  const [isLoading, setIsLoading] = useState(true) // Needed to let the temporary solution for setting the user role happen before checking if user is admin or not
  const navigate = useNavigate()

  const adminUsers = users.filter(user => user.role === "admin")
  const memberUsers = users.filter(user => user.role === "member")
  const [activeTab, setActiveTab] = useState("members") // "members" or "admins"
  const [selectedUser, setSelectedUser] = useState(null)

  const [groupByPostalCode, setGroupByPostalCode] = useState(false)

  // Group users by postal code
  const groupedByPostalCode = memberUsers.reduce((acc, user) => {
    const postal = user.postalCode || "Unknown"
    if (!acc[postal]) acc[postal] = []
    acc[postal].push(user)
    return acc
  }, {})

  // Function to fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users from the backend
        const response = await axios.get("/api/admin/all/users", { withCredentials: true })
        setUsers(response.data)
        setUserRole("admin") // Assumes admin role since that is what is allowed when fetching users. Temporary fix for now since load times will make this solution bad.
      } catch (err) {
        if (err.response?.status === 403) {
          setError("Admin access required!")
          setIsAuthenticated(false)
        } else {
          setError("Error fetching users.!")
        }
      } finally {
        setIsLoading(false) // Done loading
      }
    }

    fetchUsers()
  }, [])

  // Handle user update
  const handleUpdate = (user) => {
    // Navigate to the UpdateUser page, passing user data as state
    navigate("/admin/update-user", { state: { user } })
  }

  // Handle user delete
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`, { withCredentials: true, headers: {"X-CSRF-Token": csrfToken} })
      // Refresh the list of users
      setUsers(users.filter((user) => user._id !== userId))
    } catch (err) {
      alert("Failed to delete user!")
    }
  }

  // Delay rendering until we know the user role
  if (isLoading) {
    return <div>Loading...</div>
  }

  // Validate if the user is authenticated and an admin
  if (!isAuthenticated || userRole !== "admin") {
    navigate("/login")
    return 
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 sm:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
                            <button onClick={() => handleDelete(user._id)} className="mr-4 text-red-600 hover:text-red-900">Delete</button>
                            <button onClick={() => setSelectedUser(user)}className="mr-4 text-green-600 hover:text-green-900">View</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                ))
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
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

export default AdminDashboard
