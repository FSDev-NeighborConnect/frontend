import React from "react"
import { useNavigate } from "react-router-dom"

const AdminMainDashboard = () => {
  const navigate = useNavigate()

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
        onClick={() => navigate("/admin/dashboard-users")} // Change to correct navigation
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